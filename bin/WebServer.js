#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('mycloud:WebServer');
var http = require('http');
const https = require('https');
const fs = require('fs');


var server;

class WebServer {

    /**
     * Get port from environment and store in Express.
     */
    listenOnPort(port) {
        var port = this.normalizePort(process.env.PORT || port);
        app.set('port', port);

        /**
         * Create HTTP WebServer.
         */
        const options = {
            key: fs.readFileSync('keys/private.key'),
            cert: fs.readFileSync('keys/certificate.crt'),
            ca: fs.readFileSync('keys/ca_bundle.crt'),
        };

        server = https.createServer(options,app);

        /**
         * Listen on provided port, on all network interfaces.
         */

        server.listen(port);
        server.on('error', this.onError);
        server.on('listening', this.onListening);

    };

    /**
     * Normalize a port into a number, string, or false.
     */

    normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    };

    /**
     * Event listener for HTTP WebServer "error" event.
     */

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    /**
     * Event listener for HTTP WebServer "listening" event.
     */

    onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}

module.exports = new WebServer();