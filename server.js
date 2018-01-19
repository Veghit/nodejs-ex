/**
 */
const WebServer = require('./bin/WebServer')
const DB = require('./server/data/DB')


DB.connectDB()
    .then(_=> {
        WebServer.listenOnPort('8080')
        console.log('listening on port 8080')
    }).catch(err => console.log(err))



