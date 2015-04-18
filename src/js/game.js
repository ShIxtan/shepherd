(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('tiles', 'gameTiles');

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

      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    createPriest: function() {
      this.priests = this.priests || this.game.add.group()
      this.game.physics.arcade.enable(this.priests);

      var start = this.findObjectsByType('priestStart', this.map, 'objectLayer')[0];

      this.priests.create(start.x, start.y, 'priest');
    },

    createObject: function(name) {
      //create items
      this[name] = this.game.add.group();

      var result = this.findObjectsByType(name, this.map, 'objectLayer');
      result.forEach(function(element){
        this.createFromTiledObject(element, this[name]);
      }, this);
    },

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
      var result = new Array();
      map.objects[layer].forEach(function(element){
        if(element.properties.type === type) {
          //Phaser uses top left, Tiled bottom left so we have to adjust
          //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
          //so they might not be placed in the exact position as in Tiled
          element.y -= map.tileHeight;
          result.push(element);
        }
      });
      return result;
    },
    //create a sprite from an object
    createFromTiledObject: function(element, group) {
      var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
          sprite[key] = element.properties[key];
        });
    },

    update: function () {
      this.ghost.body.velocity.y = 0;
      this.ghost.body.velocity.x = 0;

      if(this.cursors.up.isDown) {
        this.ghost.body.velocity.y -= 50;
      }
      else if(this.cursors.down.isDown) {
        this.ghost.body.velocity.y += 50;
      }
      if(this.cursors.left.isDown) {
        this.ghost.body.velocity.x -= 50;
      }
      else if(this.cursors.right.isDown) {
        this.ghost.body.velocity.x += 50;
      }
    }
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Game = Game;

}());
