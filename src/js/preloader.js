(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);

      this.loadResources();
    },

    loadResources: function () {
      this.load.tilemap('tilemap', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('gameTiles', 'assets/images/tiles.png');
      this.load.image('ghost', 'assets/images/ghost.png');
      this.load.image('priest', 'assets/images/priest.png');
      this.load.image('door', 'assets/images/door.png');
      this.load.image('shepherd', 'assets/images/shepherd.png');
    },

    create: function () {
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('game');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Preloader = Preloader;

}());
