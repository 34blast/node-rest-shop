// Server file,  uses Express to do routing
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8081;


// I use the code to increase the default limit globally:
// 0 = unbounded
require('events').EventEmitter.prototype._maxListeners = 0;

const server = http.createServer(app);

server.listen(port);
