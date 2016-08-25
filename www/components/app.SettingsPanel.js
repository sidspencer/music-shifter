(function(app) {
  app.SettingsPanelComponent =
    ng.core.Component({
      selector: 'settings-panel',
      templateUrl: 'components/app.SettingsPanel.html',
      directives: [
        app.SettingComponent
      ]
    })
    .Class({
      constructor: function() {
        this.playbackRate = {
          'id': "playbackRate",
          'text': "Playback Rate: ",
          'value': "1.7"
        };

        this.bassLevel = {
          'id': "bassLevel",
          'text': "Bass Level: ",
          'value': "20"
        };

        this.midLevel = {
          'id': "midLevel",
          'text': "Mid Level: ",
          'value': "0"
        };

        this.trebleLevel = {
          'id': "trebleLevel",
          'text': "Treble Level: ",
          'value': "-10"
        };
      }
    });
})(window.app || (window.app = {}));
