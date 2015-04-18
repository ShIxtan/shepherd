(function(){
  'use strict';

  var Priest = function(game, x, y, map) {
    Phaser.Sprite.call(this, game, x, y, 'priest');
    this.map = map;
    this.game = game;
    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();
    this.turning = Phaser.NONE;
    this.directions = [];
    this.enableBody = true;
    this.gridsize = map.tileHeight;
    this.speed = 80;
    this.turnSpeed = 10;
    this.anchor.set(0.5);
    this.x += this.gridsize/2;
    this.y += this.gridsize/2;

    game.physics.arcade.enable(this);

    this.body.velocity.y = -this.speed;
    this.move(Phaser.UP);
  };

  Priest.prototype = Object.create(Phaser.Sprite.prototype);
  Priest.prototype.constructor = Priest;

  Priest.prototype.update = function() {
    var x = this.marker.x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
    var y = this.marker.y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;

    var i = this.map.getLayerIndex('blockedLayer');

    this.directions[Phaser.LEFT] = this.map.getTileLeft(i, x, y);
    this.directions[Phaser.RIGHT] = this.map.getTileRight(i, x, y);
    this.directions[Phaser.UP] = this.map.getTileAbove(i, x, y);
    this.directions[Phaser.DOWN] = this.map.getTileBelow(i, x, y);

    if (this.directions[this.heading].canCollide){
      this.changeDirection();
    }
    if (this.turning !== Phaser.NONE) {
      if (this.game.math.fuzzyEqual(this.x, this.turnPoint.x, 3) &&
          this.game.math.fuzzyEqual(this.y, this.turnPoint.y, 3)){
        this.x = this.turnPoint.x;
        this.y = this.turnPoint.y;

        this.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;
      }
    }
  };

  Priest.prototype.changeDirection = function(){
    if (this.checkDirection(Phaser.RIGHT)){
    } else if (this.checkDirection(Phaser.UP)){
    } else if (this.checkDirection(Phaser.DOWN)){
    } else {
      this.checkDirection(Phaser.LEFT);
    }
  };

  Priest.prototype.checkDirection = function(turnTo){
    if (this.directions[turnTo].canCollide){
      return false;
    } else {
      this.turning = turnTo;

      this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
      this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
      return true;
    }
  };

  Priest.prototype.move = function(direction){
    var speed = this.speed;

    if (direction === Phaser.LEFT || direction === Phaser.UP) {
      speed = -speed;
    }
    if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
      this.body.velocity.x = speed;
    } else {
      this.body.velocity.y = speed;
    }

    //this.game.add.tween(this).to( { angle: this.getAngle(direction) }, this.turnSpeed, 'Linear', true);

    this.heading = direction;
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Priest = Priest;
}());
