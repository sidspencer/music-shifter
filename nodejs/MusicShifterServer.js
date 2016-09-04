var http = require('http');

var hostname = '127.0.0.1';
var port = 3003;

var server = http.createServer(function (request, response) {
      response.writeHead(200, 
            {
                  "Content-Type": "text/plain",
                  "Access-Control-Allow-Origin": "*"
            }
      );

      response.end('[ { "id": 1, "name": "bob", "playbackRate": 3, "trebleLevel": 3, "midLevel": 3, "bassLevel": 3 } ]');
});

server.listen(port);

// // Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
