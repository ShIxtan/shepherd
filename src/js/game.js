(function() {
  'use strict';

  function Level() {
    this.player = null;
  }

  Level.prototype = {
    create: function () {
      this.scare = this.add.audio('scare', 0.5);
      this.exorcise = this.add.audio('exorcise', 0.5);

      this.map = this.add.tilemap(this.level);
      this.map.addTilesetImage('tiles', 'gameTiles');
      this.timer = this.time.create();
      this.timer.start();

      this.backgroundLayer = this.map.createLayer('backgroundLayer');
      this.blockedLayer = this.map.createLayer('blockedLayer');

      this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

      this.backgroundLayer.resizeWorld();

      this.priests = this.add.group();
      this.createObject('door');
      this.createObject('shepherd');
      this.createGhost();
      this.createPriest();
    },

    createGhost: function() {
      this.ghostStart = this.findObjectsByType('ghostStart', this.map, 'objectLayer')[0];

      this.ghost = this.add.sprite(this.ghostStart.x, this.ghostStart.y, 'ghost');
      this.physics.arcade.enable(this.ghost);
      this.ghost.enableBody = true;
      this.ghost.body.collideWorldBounds = true;
      this.ghost.alpha = 0.3;
      this.ghost.anchor.set(0.5);
      this.ghost.x += this.map.tileHeight/2;
      this.ghost.y += this.map.tileHeight/2;

      //move ghost with cursor keys
      this.cursors = this.input.keyboard.createCursorKeys();
    },

    createPriest: function() {
      this.priestStart = this.priestStart || this.findObjectsByType('priestStart', this.map, 'objectLayer')[0];
      var priest = new this.game.Priest(this, this.priestStart.x, this.priestStart.y, this.map, this.shepherd.children[0]);

      this.priests.add(priest);
      if (this.priests.countLiving() + this.priests.countDead() < this.priestCount){
        this.timer.add(Math.random()*this.priestGen + 1000, this.createPriest, this);
      }
    },

    createObject: function(name) {
      //create items
      this[name] = this.add.group();

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
      this.physics.arcade.enable(sprite);
      sprite.enableBody = true;

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
    },

    update: function () {
      this.physics.arcade.collide(this.priests, this.blockedLayer);
      this.physics.arcade.overlap(this.priests, this.ghost, this.handleCollision.bind(this));
      this.physics.arcade.overlap(this.priests, this.shepherd, this.lose.bind(this));
      this.moveGhost();

      if (this.priests.countDead() >= this.priestCount){
        this.win();
      }
    },

    handleCollision: function(ghost, priest) {
      ghost.body.enable = false;
      var tw = this.add.tween(ghost);
      tw.to( { x: this.ghostStart.x, y: this.ghostStart.y }, 300, 'Linear', true);
      tw.onComplete.add(function(){
        ghost.body.enable = true;
      })

      if (((priest.heading === Phaser.UP) && priest.body.touching.up) || ((priest.heading === Phaser.DOWN) && priest.body.touching.down) || ((priest.heading === Phaser.LEFT) && priest.body.touching.left) || ((priest.heading === Phaser.RIGHT) && priest.body.touching.right)) {
        this.exorcise.play();
      } else {
        priest.scare();
        this.scare.play();
      }
    },

    win: function() {
      this.game.state.start(this.nextLevel);
    },

    lose: function() {
      this.game.state.restart(true, false);
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
      if (this.ghost.body.velocity.y || this.ghost.body.velocity.x) {
        this.ghost.rotation = Math.atan2(this.ghost.body.velocity.y, this.ghost.body.velocity.x );
      }
    }
  };

  var Level1 = function() {
    Level.call(this);
    this.level = 'level1';
    this.nextLevel = 'level2';
    this.priestCount = 10;
    this.priestGen = 4000;
  };

  Level1.prototype = Object.create(Level.prototype);
  Level1.prototype.constructor = Level1;

  var Level2 = function() {
    Level.call(this);
    this.level = 'level2';
    this.nextLevel = 'level3';
    this.priestCount = 10;
    this.priestGen = 4000;
  };

  Level2.prototype = Object.create(Level.prototype);
  Level2.prototype.constructor = Level2;

  var Level3 = function() {
    Level.call(this);
    this.level = 'level3';
    this.nextLevel = 'level1';
    this.priestCount = 10;
    this.priestGen = 4000;
  };

  Level3.prototype = Object.create(Level.prototype);
  Level3.prototype.constructor = Level3;

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Level = Level;
  window['shepherd'].Level1 = Level1;
  window['shepherd'].Level2 = Level2;
  window['shepherd'].Level3 = Level3;

}());
