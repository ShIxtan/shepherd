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
      this.ghostStart = this.findObjectsByType('ghostStart', this.map, 'objectLayer')[0];

      this.ghost = this.game.add.sprite(this.ghostStart.x, this.ghostStart.y, 'ghost');
      this.game.physics.arcade.enable(this.ghost);
      this.ghost.enableBody = true;
      this.ghost.body.collideWorldBounds = true;

      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    createPriest: function() {
      this.priests = this.priests || this.game.add.group();

      this.priestStart = this.priestStart || this.findObjectsByType('priestStart', this.map, 'objectLayer')[0];
      var priest = new this.game.Priest(this.game, this.priestStart.x, this.priestStart.y, this.map);

      this.priests.add(priest);
      if (this.priests.total < 10){
        this.timer.add(Math.random()*10000, this.createPriest, this);
      }
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
      this.game.physics.arcade.overlap(this.priests, this.ghost, this.handleCollision.bind(this));
      this.moveGhost();
    },

    handleCollision: function(ghost, priest) {
      if (((priest.heading === Phaser.UP) && priest.body.touching.up) || ((priest.heading === Phaser.DOWN) && priest.body.touching.down) || ((priest.heading === Phaser.LEFT) && priest.body.touching.left) || ((priest.heading === Phaser.RIGHT) && priest.body.touching.right)) {
        this.game.add.tween(this.ghost).to( { x: this.ghostStart.x, y: this.ghostStart.y }, 300, 'Linear', true);
      }
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
