(function(app) {
  app.SettingComponent =
    ng.core.Component({
      selector: 'setting',
      templateUrl: 'components/app.SettingComponent.html',
      inputs: [
        'descriptor',
        'settingValue'
      ]
    })
    .Class({
      constructor: function() {
      },
      ngOnInit: function() {
      }
    });

    ng.core.Input('descriptor', app.SettingComponent);
})(window.app || (window.app = {}));
