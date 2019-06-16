# Vhost Add

A command tool to create virtual host for apache and nginx.

[![npm version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/vhost-add.svg?style=flat
[npm-url]: https://npmjs.org/package/vhost-add
[david-image]: https://img.shields.io/david/yunnysunny/vhost-add.svg?style=flat-square
[david-url]: https://david-dm.org/yunnysunny/vhost-add
[node-image]: https://img.shields.io/badge/node.js-%3E=_6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/


## Usage
Firt you should given some envrionment variables:

- `NGINX_BIN_DIR` The directory of nginx executable file.
- `NGINX_VHOST_DIR` The diretory of nginx virtual host files.
- `APACHE_BIN_DIR` The directory of apache executable file.
- `APACHE_VHOST_DIR` The diectory of apache virtual host files.

If you use it for creating apache vhost, the variables `APACHE_BIN_DIR` and `APACHE_VHOST_DIR` must be exist, and when you use nginx ,the variables `NGINX_BIN_DIR` and `NGINX_VHOST_DIR` are also needed.

```
Usage: vhost-add [options]

Options:
  -V, --version          output the version number
  -d, --domain [domain]  The local domain of your site (default: "localhost")
  -p --port [port]       The port of your site (default: 80)
  -r, --root [root]      The root path of your site (default: ".")
  -s, --server [server]  The server type (default: "nginx")
  -h, --help             output usage information
```


## Known issues
### not installed service name "Apache2.2"
You may meet with the error of `not installed service name "Apache2.2"`. It cased by not installing apache as a service. Just run `httpd -k install -n Apache2.2` can resolve it. But If you have installed the service already, run `regedit` and find the apache service from `HKEY_LOCAL_MACHINE\SYSTEM\Services` and then rename it to `Apache2.2`.



