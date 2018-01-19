/**
 */
const WebServer = require('./bin/WebServer')
const DB = require('./server/data/DB')


DB.connectDB()
    .then(_=> {
        WebServer.listenOnPort('3000')
        console.log('listening on port 3000')
    }).catch(err => console.log(err))



