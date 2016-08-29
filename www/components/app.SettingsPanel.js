(function(app) {
  app.SettingsPanelComponent =
    ng.core.Component({
      selector: 'settings-panel',
      templateUrl: 'components/app.SettingsPanel.html',
      directives: [
        app.SettingComponent
      ],
      providers: [
        app.SettingService
      ]
    })
    .Class({
      constructor: [app.SettingService, function(settingService) {
        this.settingService = settingService;
        
        this.playbackRate = {
          'id': "playbackRate",
          'label': "Playback Rate: ",
          'value': "1.7"
        };

        this.bassLevel = {
          'id': "bassLevel",
          'label': "Bass Level: ",
          'value': "20"
        };

        this.midLevel = {
          'id': "midLevel",
          'label': "Mid Level: ",
          'value': "0"
        };

        this.trebleLevel = {
          'id': "trebleLevel",
          'label': "Treble Level: ",
          'value': "-10"
        };
      }
    ]
  });
})(window.app || (window.app = {}));
