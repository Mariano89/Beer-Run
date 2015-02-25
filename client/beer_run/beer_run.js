if (Meteor.isClient) { 
   Template.game.game = function(){
       /*all your game code here*/


        var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        function preload() {

            game.load.image('sky', '../images/citybackground.png');
            game.load.image('ground', '../images/platform.png');
            game.load.image('beer', '../images/beer.png');
            game.load.image('keg', '../images/keg.png');
            game.load.image('heart', '../images/heart.png');
            game.load.spritesheet('dude', '../images/dude.png', 45, 62);
            game.load.spritesheet('baddie', '../images/baddie.png', 32, 32);

        }

        var player;
        var enemy;
        var platforms;
        var cursors;

        var beers;
        var heart;
        var score = 0;
        var scoreText;

        function create() {

            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.NINJA);

            //  A simple background for our game
            var sky = game.add.sprite(0, -27, 'sky');
           
            // Auto scroll
            var tileSprite = game.add.tileSprite(0, -27, 653, 352, 'sky');
            sky = game.add.tileSprite(0, -27, 653, 352, 'sky');
            sky.autoScroll(-200, 0);
            sky.scale.setTo(2, 1.6);

            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // // Here we create the ground.
            // var ground = platforms.create(0, game.world.height - 64, 'ground');

            // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            // ground.scale.setTo(6, 2);

            // //  This stops it from falling away when you jump on it
            // ground.body.immovable = true;

            //  Now let's create ledges
            
            // for(var i = 0; i < 5; i++) {
            //     ledge = platforms.create(400 * i, game.world.height - 64, 'ground');
            //     ledge.body.immovable = true;
            //     ledge.body.velocity.x = -400;
            //     ledge.checkWorldBounds = true;
            //     ledge.outOfBoundsDestroy = true;
            // }

            for(var i = 0; i < 20; i++) {
                ledge = platforms.create(600 * i, game.world.height - 100, 'ground');
                ledge.scale.setTo(1, 5);
                ledge.body.immovable = true;
                ledge.body.velocity.x = -400;
                ledge.checkWorldBounds = true;
                ledge.outOfBoundsDestroy = true;

                ledge2 = platforms.create(1200 * i, game.world.height - 150, 'ground');
                ledge2.scale.setTo(1, 5);
                ledge2.body.immovable = true;
                ledge2.body.velocity.x = -400;
                ledge2.checkWorldBounds = true;
                ledge2.outOfBoundsDestroy = true;
            }
            // ledge1 = platforms.create(1150, 470, 'ground');
            // ledge1.body.immovable = true;
            // ledge1.body.velocity.x = -400;
            // ledge1.checkWorldBounds = true;
            // ledge1.outOfBoundsDestroy = true;

            // The player and its settings
            player = game.add.sprite(300, game.world.height - 220, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            // player.body.bounce.y = 0.2;
            player.body.gravity.y = 750;
            player.body.collideWorldBounds = false;
            player.body.outofBoundsKill = true;

            //  Our two animations, walking left and right.
            player.animations.add('jump', [1], 10, true );
            player.animations.add('right', [0, 1, 2, 3], 8, true);

            // enemy enters
            enemy = game.add.sprite(600, game.world.height - 220, 'baddie');
            game.physics.arcade.enable(enemy);
            enemy.body.gravity.y = 750;
            enemy.body.velocity.x = -150;
            // enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.body.collideWorldBounds = false;
            enemy.animations.add('left', [0, 1], 8, true);
            enemy.animations.play('left');
            

            //  Finally some beers to collect
            beers = game.add.group();
            // beers = game.add.beers(0, -27, 27, 27, 'beer');
            // beers.autoScroll(-80, 0);
            // beers.scale.setTo(2, 1.6);

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

                beer.body.velocity.x = -400;
                beer.checkWorldBounds = true;
                beer.outOfBoundsDestroy = true;
                
            }

            for (var i = 0; i < 100; i++)
            {
                var beer = beers.create(i * 60, 400, 'beer');
                beer.body.velocity.x = -400;
                beer.checkWorldBounds = true;
                beer.outOfBoundsDestroy = true;
            }

            kegs = game.add.group();
            kegs.enableBody = true;

            for (var i = 0; i < 10; i++)
            {
                var keg = kegs.create(i * 100, 300, 'keg');
                keg.body.velocity.x = -400;
                keg.checkWorldBounds = true;
                keg.outOfBoundsDestroy = true;
            }


            //  The score
            scoreText = game.add.text(1050, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

            // Player lives
            heart = game.add.sprite(16, 16, 'heart');

            //  Our controls.
            cursors = game.input.keyboard.createCursorKeys();
            space = game.input.keyboard.addKey(32);
            shift = game.input.keyboard.addKey(16);
            
        }

        function update() {

            //  Collide the player and the beers with the platforms
            game.physics.arcade.collide(player, enemy);
            game.physics.arcade.collide(player, platforms);
            
            game.physics.arcade.collide(enemy, platforms);
            game.physics.arcade.collide(beers, platforms);
            game.physics.arcade.collide(kegs, platforms);

            //  Checks to see if the player overlaps with any of the beers, if he does call the collectBeer function
            game.physics.arcade.overlap(player, beers, collectBeer, null, this);
            game.physics.arcade.overlap(player, kegs, collectKeg, null, this);

            //  Player moves to the right;
            player.body.velocity.x = 400;

            //  Allow the player to jump if they are touching the ground.
            if (space.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -415;
            }
            else if(player.body.touching.down == false){
                player.animations.play('jump');
                player.body.velocity.x = 0;
            }
            else{
                player.animations.play('right');
            }

        }

        function collectBeer (player, beer) {
            
            // Removes the beer from the screen
            beer.destroy();

            //  Add and update the score
            score += 1;
            scoreText.text = 'Score: ' + score;
        }

        function collectKeg (player, keg) {
            // Removes the beer from the screen
            keg.destroy();

            //  Add and update the score
            score += 10;
            scoreText.text = 'Score: ' + score;
        }

                // END OF PHASER-METEOR
   }
}
