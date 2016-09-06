// Imports and constants.
var http = require('http');

var hostname = '127.0.0.1';
var port = 3003;

var mockEq = { 
      "id": 0, 
      "name": "mockEq", 
      "playbackRate": 3, 
      "trebleLevel": 3, 
      "midLevel": 3, 
      "bassLevel": 3 
};


// Service
var service = {
      eqs: [mockEq],
      nextEqId: 1,

      getEqs: function() {
            return this.eqs;
      },
      setEqs: function(eqs) {
            this.eqs = eqs;
            return this.eqs;
      },
      createEq: function addEq(eq) {
            eq.id = nextEqId;
            nextEqId++;

            this.eqs.push(eq);

            return eq.id;
      },
      getEqById: function getEqById(eqId) {
          for (var i = 0; i < this.eqs.length; i++) {
                if (this.eqs[i].id == eqId) {
                      return this.eqs[i];
                }
          }

          // Failure case
          return undefined;
      },
      updateEq: function updateEq(eq) {
            for (var i = 0; i < this.eqs.length; i++) {
                  if (this.eqs[i].id == eq.id) {
                        this.eqs[i] = eq;
                        return eq;
                  }
            }

            // Failure case
            return undefined;
      },
      deleteEq: function deleteEq(eq) {
            for (var i = 0; i < this.eqs.length; i++) {
                  if (this.eqs[i].id == eq.id) {
                        this.eqs.splice(i);
                        return true;
                  }
            }

            // Failure case
            return false;
      }

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
      },
      writeErrorStatusWithMessage: function writeErrorStatusWithMessage(response, message) {
            this.writeHeadWithStatus(response, 500);
            response.end(JSON.stringify({
                  error: message
            }))
      }
};

// Create Server
var server = http.createServer(function (request, response) {
      if (!request.url.match(/^\/eqs\//)) {
            utils.writeErrorStatusWithMessage(response, "No such service.");
      }

      if (request.url.match(/^\/eqs\/eq/)) {
            if (request.method == "PUT") {
                  try {
                        var selectedEq = JSON.parse(response.body);

                        if ((selectedEq = service.updateEq(selectedEq)) == undefined) {
                              utils.writeErrorStatusWithMessage(response, "No such EQ.");
                        } 
                        else {
                              utils.writeHeadWithStatus(response, 200);
                              response.end(JSON.stringify(selectedEq));
                        }
                  }
                  catch (ex) {
                        utils.writeErrorStatusWithMessage(response, "Invalid data format.");
                  }
            }
      }

      if (request.method == "GET") {
            utils.writeHeadWithStatus(response, 200);
            response.end(JSON.stringify(service.getEqs()));
      }
      else if (request.method == "PUT") {
            try {
                  service.setEqs(JSON.parse(response.body));
                  utils.writeHeadWithStatus(response, 200);
                  response.end((response.body));
            }
            catch (ex) {
                  utils.writeErrorStatusWithMessage(response, "Invalid data format.")
            }
      }
      else if (request.method == "POST") {
            try {
                  var newEq = JSON.parse(response.body);

                  if ((newEq = this.createEq(newEq)) == undefined) {
                        utils.writeErrorStatusWithMessage(response, "Error creating new EQ.");
                  }
                  else {
                        utils.writeHeadWithStatus(response, 200);
                        response.end(JSON.stringify(newEq));
                  }
            }
            catch (ex) {
                  utils.writeErrorStatusWithMessage(response, "Invalid data format.");
            }
      }
      else if (request.method == "DELETE") {
            service.setEqs({});
      }
});



server.listen(port);

// // Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
