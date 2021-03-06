window.onload = function () {
  'use strict';

  var game, ns = window['shepherd'];

  game = new Phaser.Game(640, 480, Phaser.AUTO, 'shepherd-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('level1', ns.Level1);
  game.state.add('level2', ns.Level2);
  game.state.add('level3', ns.Level3);
  game.state.add('level4', ns.Level4);
  game.state.add('level5', ns.Level5);

  /* yo phaser:state new-state-files-put-here */

  game.Priest = ns.Priest;

  game.state.start('boot');
};
