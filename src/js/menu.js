(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {

    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Menu = Menu;

}());
