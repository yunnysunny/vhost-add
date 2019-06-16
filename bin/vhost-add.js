#!/usr/bin/env node

const params = require('commander');
const path = require('path');
const fs = require('fs');
const os = require('os');
var exec = require('child_process').exec; 

const PLATFORM = os.platform();
const IS_WIN = PLATFORM === 'win32';
const package = require('../package');

function getDirInEnv(envName) {
    const dir = process.env[envName];
    if (!dir) {
        console.error(`environment ${envName} not set`);
        return process.exit(1);
    }
    if (!fs.existsSync(dir)) {
        console.error(`${envName} does not exists`);
        return process.exit(1);
    }
    return dir;
}

params.version(package.version)
    .option('-d, --domain [domain]', 'The local domain of your site','localhost')
    .option('-p --port [port]','The port of your site',80)
    .option('-r, --root [root]', 'The root path of your site',process.cwd())
    .option('-s, --server [server]', 'The server type','nginx')
    .parse(process.argv);

const domain = params.domain;
const root = params.root;
const port = params.port;
const isNginx = params.server === 'nginx';
const vhostTplNginx = `
server {
    listen ${port};
    server_name ${domain};
    location / {
        add_header Cache-Control no-cache,no-store;
        index index.html index.htm index.php;
        root ${root};
        autoindex on;
    }
}`;
const vhostTplApache = `
<VirtualHost *:${port}>
    ServerName ${domain}
    DocumentRoot ${root}
    ErrorLog \${APACHE_LOG_DIR}/${domain}-error.log
    CustomLog \${APACHE_LOG_DIR}/${domain}-access.log combined
</VirtualHost>

<Directory "${root}">
    Options  Indexes FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
    Require all granted
</Directory>`;
let restartCmd = '';
let vhostDir = '';
let vhostTpl = '';
if (isNginx) {
    const nginxBinPath = path.join(getDirInEnv('NGINX_BIN_DIR'),'nginx');
    restartCmd = `${nginxBinPath} -s reload`;
    vhostTpl = vhostTplNginx;
    vhostDir = getDirInEnv('NGINX_VHOST_DIR');
} else {
    const apacheBinPath = path.join(getDirInEnv('APACHE_BIN_DIR'),'apache2ctl');
    restartCmd = `${apacheBinPath} restart`;
    vhostTpl = vhostTplApache;
    vhostDir = getDirInEnv('APACHE_VHOST_DIR');
}

const vhostFile = path.join(vhostDir,`${domain}.conf`);
fs.writeFileSync(vhostFile,vhostTpl);
console.log('Create vhost file:',vhostFile);

let hostsPath = '/etc/hosts';
if (IS_WIN) {
    hostsPath = `${process.env.windir}/system32/drivers${hostsPath}`;
}
fs.appendFileSync(hostsPath,`\n127.0.0.1 ${domain}`);
console.log('Append the ' + domain + ' to ' + hostsPath);

exec(restartCmd,function(err, stdout, stderr) {
    if (err) {
        console.error('run ' + restartCmd + ' error',err);
        return process.exit(1);
    }
    console.log(stdout);

    if (stderr) {
        console.error(stderr);
    } else {
        console.log(`Restart ${params.server} finish`);
    }
});

