(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {
    init: function(nextLevel){
      this.nextLevel = nextLevel;
    },

    create: function () {
      var background = this.add.sprite(0, 0, "title");

      this.input.keyboard.onDownCallback = this.onDown.bind(this);
    },

    update: function () {

    },

    onDown: function (e) {
      this.game.state.start(this.nextLevel);
      this.input.keyboard.onDownCallback = null;
    }
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Menu = Menu;

}());
