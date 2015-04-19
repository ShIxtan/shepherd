(function(){
  'use strict';

  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  var Priest = function(game, x, y, map, target) {
    Phaser.Sprite.call(this, game, x, y, 'priest');
    this.map = map;
    this.layer = this.map.getLayerIndex('blockedLayer');
    this.game = game;
    this.marker = new Phaser.Point();
    this.target = new Phaser.Point();
    this.turnPoint = new Phaser.Point();
    this.turning = Phaser.NONE;
    this.directions = [];
    this.enableBody = true;
    this.gridsize = map.tileHeight;
    this.speed = 80;
    this.turnSpeed = 150;
    this.anchor.set(0.5);
    this.x += this.gridsize/2;
    this.y += this.gridsize/2;
    this.scared = false;
    this.marker.x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
    this.marker.y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;
    this.target.x = this.game.math.snapToFloor(Math.floor(target.x), this.gridsize) / this.gridsize;
    this.target.y = this.game.math.snapToFloor(Math.floor(target.y), this.gridsize) / this.gridsize;
    this.path = this.findPath(this.marker.x, this.marker.y);

    this.path_index = 1;
    this.turning = this.path[1]

    game.physics.arcade.enable(this);

    this.move(this.path[0]);
  };

  Priest.prototype = Object.create(Phaser.Sprite.prototype);
  Priest.prototype.constructor = Priest;

  Priest.prototype.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
  Priest.prototype.DIRS = [[0,0], [-1, 0], [1, 0], [0, -1], [0, 1]];

  Priest.prototype.update = function() {
    var x = this.marker.x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
    var y = this.marker.y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;

    this.directions = this.getSurroundings(x, y)

    if (!this.directions[this.heading]){
      this.kill();
    }
    if (!!this.turning){
      if (this.game.math.fuzzyEqual(this.x, this.turnPoint.x, 3) &&
          this.game.math.fuzzyEqual(this.y, this.turnPoint.y, 3)){
        this.x = this.turnPoint.x;
        this.y = this.turnPoint.y;

        this.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);
        this.path_index += this.scared ? -1 : 1;
        this.turning = this.scared? this.opposites[this.path[this.path_index]] : this.path[this.path_index];
      }
    }
  };

  Priest.prototype.move = function(direction){
    if (direction){
      var speed = this.speed;

      if (direction === Phaser.LEFT || direction === Phaser.UP) {
        speed = -speed;
      }
      if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
        this.body.velocity.x = speed;
      } else {
        this.body.velocity.y = speed;
      }

      this.game.add.tween(this).to( { angle: this.getAngle(direction) }, this.turnSpeed, 'Linear', true);

      this.heading = direction;
      this.turnPoint.x = ((this.marker.x + this.DIRS[direction][0]) * this.gridsize) + (this.gridsize / 2);
      this.turnPoint.y = ((this.marker.y + this.DIRS[direction][1]) * this.gridsize) + (this.gridsize / 2);
    }
  };

  Priest.prototype.scare = function(){
    if (!this.scared){
      this.scared = true;
      this.speed = 160;
      this.path_index++;
    }
  };

  Priest.prototype.getAngle = function (to) {
    if (this.heading === to){
      return "0";
    }
    if (this.heading === this.opposites[to]) {
        return "180";
    }

    if ((this.heading === Phaser.UP && to === Phaser.LEFT) ||
        (this.heading === Phaser.DOWN && to === Phaser.RIGHT) ||
        (this.heading === Phaser.LEFT && to === Phaser.DOWN) ||
        (this.heading === Phaser.RIGHT && to === Phaser.UP)) {
      return "-90";
    }
    return "90";
  };

  Priest.prototype.findPath = function(x, y, seen){
    var seen = seen || {};
    var surroundings = this.getSurroundings(x, y)

    if (x === this.target.x && y === this.target.y){
      return [0];
    }

    var dirs = shuffle([1,2,3,4]);

    for (var i = 0; i < 4; i++) {
      var tile = surroundings[dirs[i]];
      if (tile && !tile.canCollide && !seen[tile.x + " " + tile.y] ){
        seen[x + " " + y] = true;
        var path = this.findPath(tile.x, tile.y, seen);
        if (path) {
          return [dirs[i]].concat(path);
        }
      }
    }

    return false;
  };

  Priest.prototype.getSurroundings = function(x, y) {
    var dirs = []
    dirs[Phaser.LEFT] = this.map.getTileLeft(this.layer, x, y);
    dirs[Phaser.RIGHT] = this.map.getTileRight(this.layer, x, y);
    dirs[Phaser.UP] = this.map.getTileAbove(this.layer, x, y);
    dirs[Phaser.DOWN] = this.map.getTileBelow(this.layer, x, y);

    return dirs;
  };

  window['shepherd'] = window['shepherd'] || {};
  window['shepherd'].Priest = Priest;
}());
