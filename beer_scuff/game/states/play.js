'use strict';

var Dude = require('../prefabs/dude');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 750;

    this.background = this.game.add.tileSprite(0, -35, 653, 352, 'background');
    this.background.autoScroll(-100, 0);
    this.background.scale.setTo(2, 2);
  },
  update: function() {

  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;