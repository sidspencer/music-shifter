(function(app) {
  app.SettingService = function SettingService() {  };

  /* - CONFIG - */
  var WS_URL = "http://localhost:3003/eq/";

  // The full list of EQ objects returned from the server. basically just set by refreshFromServer()
  var _savedEqs = [];
  
  // All fields intentionally left as undefined. This is a hash of the EQ settings corresponding
  // to the SETTING_ENTRIES as found from the data returned from the server for the given EQ.  
  var _currentEq = {
    id: undefined,
    name: undefined,
    settings: {
      playbackRate: 1,
      trebleLevel: 2,
      midLevel: 3,
      bassLevel: 4
    }
  };

  var SETTING_ENTRIES = [
    {
      name: "speedFactor",
      label: "Speed Factor",
      range: [0.01, 3]
    },
    {
      name: "trebleLevel",
      label: "Treble Level",
      range: [-42, 42]
    },
    {
      name: "midLevel",
      label: "Mid Level",
      range: [-42, 42]
    },
    {
      name: "bassLevel",
      label: "Bass Level",
      range: [-42, 42]
    }
  ];

  Object.defineProperty(app.SettingService.prototype, "settingEntries", {
    get: function getSettingEntries() {
      return SETTING_ENTRIES;
    },
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(app.SettingService.prototype, "refreshFromServer", {
    value: function refreshFromServer(http) {
      var httpData = "";

      // Do http get. Put the EQ settings into the array
      http.get(WS_URL).subscribe(
        function success(response) {
          _savedEqs = response.json();
        },
        function failure() {
          console.log("Failed to get settings")
        },
        function completion(response) {
          console.log("Got settings");
        }
      );
    },
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(app.SettingService.prototype, "savedEqs", {
    get: function getSavedEqs() {
      return _savedEqs;
    },
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(app.SettingService.prototype, "currentEq", {
    value: _currentEq,
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(app.SettingService.prototype, "attachEqFilters", {
    value: function attachEqFilters(bufferSource) {
      bufferSource.playbackRate.value = _currentEq.settings.playbackRate;

      var low = audioContext.createBiquadFilter();
      low.type = "peaking";
      low.frequency.value = 320.0;
      low.Q.value = 0.5
      low.gain.value = _currentEq.settings.bassLevel;
      low.connect(audioContext.destination);

      var mid = audioContext.createBiquadFilter();
      mid.type = "peaking";
      mid.frequency.value = 1000.0;
      mid.Q.value = 0.5;
      mid.gain.value = _currentEq.settings.midLevel;
      mid.connect(low);

      var high = audioContext.createBiquadFilter();
      high.type = "peaking";
      high.frequency.value = 3200.0;
      high.Q.value = 0.5;
      high.gain.value = _currentEq.settings.trebleLevel;
      high.connect(mid);

      bufferSource.connect(high);    
    },
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(app.SettingService.prototype, "saveCurrentEq", {
    value: function saveCurrentEq(http) {
      // Do http post of current Eq.
      http.post(PHP_WS, JSON.parse(_currentEq)).subscribe(
        function incremental() {},
        function failure() {
          console.log("Failed to create new EQ");
        },
        function complete(response) {
          console.log("Created new EQ");
          console.log(JSON.stringify(response));
        }
      );

      // push into list.
      _savedEqs.push(_currentEq);
      _currentEq = {
        id: undefined,
        name: undefined,
        settings: {}
      };

      // perform a refresh.
    },
    enumerable: true,
    configurable: false
  });

})(window.app || (window.app = {}));
