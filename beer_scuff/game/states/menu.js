
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.background = this.game.add.tileSprite(0, -35, 653, 352, 'background');
    this.background.scale.setTo(2, 2);

    this.ground = this.game.add.tileSprite(0, 530, this.game.world.width, this.game.world.height, 'ground');

    this.title = this.game.add.sprite(this.game.width/2, 250,'title');
    this.title.scale.setTo(1.2, 1.2);
    this.title.anchor.setTo(0.5, 1);

    this.game.add.tween(this.title).to({y:200}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.scale.setTo(2, 2);
    this.startButton.anchor.setTo(0.5,0.5);
  },
  startClick: function() {  
    this.game.state.start('play');
  },
  update: function() {
  }
};

module.exports = Menu;
