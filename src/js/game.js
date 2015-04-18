(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('tiles', 'gameTiles');
      this.timer = this.time.create();
      this.timer.start();

      this.backgroundLayer = this.map.createLayer('backgroundLayer');
      this.blockedLayer = this.map.createLayer('blockedLayer');

      this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

      this.backgroundLayer.resizeWorld();
      this.createObject('door');
      this.createObject('shepherd');
      this.createGhost();
      this.createPriest();
    },

    createGhost: function() {
      var start = this.findObjectsByType('ghostStart', this.map, 'objectLayer')[0];

      this.ghost = this.game.add.sprite(start.x, start.y, 'ghost');
      this.game.physics.arcade.enable(this.ghost);
      this.ghost.enableBody = true;
      this.ghost.body.collideWorldBounds = true

      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    createPriest: function() {
      this.priests = this.priests || this.game.add.group();

      var start = this.findObjectsByType('priestStart', this.map, 'objectLayer')[0];
      var priest = new this.game.Priest(this.game, start.x, start.y, this.map);

      this.priests.add(priest);
    },

    createObject: function(name) {
      //create items
      this[name] = this.game.add.group();

      var result = this.findObjectsByType(name, this.map, 'objectLayer');
      result.forEach(function(element){
        this.createFromTiledObject(element, this[name]);
      }, this);
    },

    findObjectsByType: function(type, map, layer) {
      var result = [];
      map.objects[layer].forEach(function(element){
        if(element.properties.type === type) {
          element.y -= map.tileHeight;
          result.push(element);
        }
      });
      return result;
    },

    createFromTiledObject: function(element, group) {
      var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
          sprite[key] = element.properties[key];
        });
    },

    update: function () {
      this.game.physics.arcade.collide(this.priests, this.blockedLayer);
      this.moveGhost();
    },

    moveGhost: function() {
      this.ghost.body.velocity.y = 0;
      this.ghost.body.velocity.x = 0;

      if(this.cursors.up.isDown) {
        this.ghost.body.velocity.y -= 100;
      }
      else if(this.cursors.down.isDown) {
        this.ghost.body.velocity.y += 100;
      }
      if(this.cursors.left.isDown) {
        this.ghost.body.velocity.x -= 100;
      }
      else if(this.cursors.right.isDown) {
        this.ghost.body.velocity.x += 100;
      }
    }
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Game = Game;

}());
