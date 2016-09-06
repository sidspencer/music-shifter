// Imports and constants.
var http = require('http');

var hostname = '127.0.0.1';
var port = 3003;

var mockEq = { "id": 1, "name": "mockEq", "playbackRate": 3, "trebleLevel": 3, "midLevel": 3, "bassLevel": 3 };


// Service
var service = {
      eqs: [mockEq]
};

// Utils
var utils = {
      writeHeadWithStatus: function writeHeadWithStatus(response, statusCode) {
                  response.writeHead(statusCode, 
                  {
                        "Content-Type": "text/json",
                        "Access-Control-Allow-Origin": "*"
                  }
            );
      }
};

// Create Server
var server = http.createServer(function (request, response) {
      if (request.method == "GET") {
            utils.writeHeadWithStatus(response, 200);
            response.end(JSON.stringify(service.eqs));
      }
});



server.listen(port);

// // Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
