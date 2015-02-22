if (Meteor.isClient) { 
   Template.game.game = function(){
       /*all your game code here*/


        var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        function preload() {

            game.load.image('sky', '../images/citybackground.png');
            game.load.image('ground', '../images/platform.png');
            game.load.image('beer', '../images/beer.png');
            game.load.spritesheet('dude', '../images/dude.png', 32, 48);

        }

        var player;
        var platforms;
        var cursors;

        var beers;
        var score = 0;
        var scoreText;

        function create() {

            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.NINJA);

            //  A simple background for our game
            var sky = game.add.sprite(0, -27, 'sky');
            sky.scale.setTo(2, 1.6);


            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(6, 2);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            //  Now let's create ledges
            ledge = platforms.create(-150, 250, 'ground');
            ledge.body.immovable = true;

            // The player and its settings
            player = game.add.sprite(1, game.world.height - 110, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 750;
            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            //  Finally some beers to collect
            beers = game.add.group();

            //  We will enable physics for any beer that is created in this group
            beers.enableBody = true;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 100; i++)
            {
                //  Create a beer inside of the 'beers' group
                var beer = beers.create(i * 30, 450, 'beer');

                // //  Let gravity do its thing
                // beer.body.gravity.y = 300;

                // //  This just gives each beer a slightly random bounce value
                // beer.body.bounce.y = 0.7 + Math.random() * 0.2;
            }

            for (var i = 0; i < 20; i++)
            {
                var beer = beers.create(i * 60, 400, 'beer');
            }

            //  The score
            scoreText = game.add.text(16, 16, 'Blood Alcohol Level: 0', { fontSize: '32px', fill: '#000' });

            //  Our controls.
            cursors = game.input.keyboard.createCursorKeys();
            space = game.input.keyboard.addKey(32);
            shift = game.input.keyboard.addKey(16);
            
        }

        function update() {

            //  Collide the player and the beers with the platforms
            game.physics.arcade.collide(player, platforms);
            game.physics.arcade.collide(beers, platforms);

            //  Checks to see if the player overlaps with any of the beers, if he does call the collectBeer function
            game.physics.arcade.overlap(player, beers, collectBeer, null, this);

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -150;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = 150;

                player.animations.play('right');
            }
            else
            {
                //  Stand still
                player.animations.stop();

                player.frame = 4;
            }
            
            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.body.velocity.y = - 350;
            }

        }

        function collectBeer (player, beer) {
            
            // Removes the beer from the screen
            beer.kill();

            //  Add and update the score
            score += 10;
            scoreText.text = 'Blood Alcohol Level: ' + score;

        }

                // END OF PHASER-METEOR
   }
}
