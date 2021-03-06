(function(app) {
  app.MusicShifterApp =
    ng.core.Component({
      selector: 'music-shifter-app',
      templateUrl: 'components/app.MusicShifterApp.html',
      directives: [
        app.SettingsPanelComponent
      ],
      providers: [
        app.SettingService,
        ng.platformBrowser.BROWSER_SANITIZATION_PROVIDERS,
        ng.http.HTTP_PROVIDERS,
        ng.core.APPLICATION_COMMON_PROVIDERS
      ]
    })
    .Class({
      constructor: [app.SettingService, ng.platformBrowser.DomSanitizationService, ng.http.Http, ng.core.ApplicationRef, function(settingService, sce, http, appRef) {
        this.file = null;
        this.bufferSource = null;
        this.recorder = null;
        this.isPlaying = false;
        this.mp3Blob = {
          url: ""
        };
        this.settingService = settingService;
        this.http = http;
        this.sce = sce;
        this.appRef = appRef;
      }],
      ngOnInit: function() {
      },
      import: function(evt) {
        console.log("IMPORT");

        var files = evt.target.files

        if (files[0]) {
            this.file = files[0];
        }
      },
      play: function(evt) {
        console.log("PLAY");

        if (this.isPlaying) {
            alert("You must stop the current track first.");
            return;
        }
        
        // Connect the buffer source for playing, and the stream destination for saving.
        this.bufferSource = audioContext.createBufferSource();
        this.bufferSource.connect(audioContext.destination);

        var output = audioContext.createMediaStreamDestination();
        var outputChunks = [];

        this.recorder = new Recorder(this.bufferSource, { "workerPath": "lib/Recorderjs-master/recorderWorker.js" });

        // Read the uploaded audio file, play it when loaded.
        var reader = new FileReader();

        var me = this;

        reader.onload = function(ev) {
            audioContext.decodeAudioData(ev.target.result, function(buffer) {
                me.bufferSource.buffer = buffer;
                    
                // Automatically stop at the end of the track.
                me.bufferSource.onended = function stopPlayingAndRecording(evt) {
                  if (this.isPlaying) {
                    me.stop();
                  }
                };

                // Attach EQ filters
                me.settingService.attachEqFilters(me.bufferSource);

                // Finally start playing/recording.
                me.bufferSource.start(0);
                me.recorder.record();
                
                me.isPlaying = true;
                me.appRef.tick();
            });
        };
        
        reader.readAsArrayBuffer(this.file);
      },
      stop: function(evt) {
        console.log("STOP");

        this.recorder.stop();
        this.bufferSource.stop();
        this.isPlaying = false;

        var me= this;

        this.recorder.exportWAV(
            function setDownloadUrl(blob) {
                me.mp3Blob['url'] =  (function () { 
                  return me.sce.bypassSecurityTrustUrl(URL.createObjectURL(blob));
                })();
                me.appRef.tick();
            },
            "audio/mp3"
        );
      },
      refresh: function refresh(evt) {
        this.settingService.refreshFromServer(this.http);
      }
    });
})(window.app || (window.app = {}));