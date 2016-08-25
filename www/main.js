(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
          
    ng.platformBrowserDynamic.bootstrap(app.MusicShifterApp);

  });
})(window.app || (window.app = {}));


var audioContext = new (window.AudioContext || window.webkitAudioContext)();

