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
        var ledges;

        var beers;
        var lives = [];
        var score = 0;
        var scoreText;
        var counter = 3;
        var timer;
        function create() {

            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.NINJA);

            //  A simple background for our game
            var sky = game.add.sprite(0, -27, 'sky');
           
            // Auto scroll
            var tileSprite = game.add.tileSprite(0, -27, 653, 352, 'sky');
            sky = game.add.tileSprite(0, -27, 653, 352, 'sky');
            sky.autoScroll(-100, 0);
            sky.scale.setTo(2, 2);

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


            // // Repetitive ledge
            // ledges = game.add.group();
            // ledges.enableBody = true;
            // ledges.createMultiple(20, 'ground');
            
            // The first ledge we are using the player to start on
            initial_ledge = platforms.create(500, game.world.height - 64, 'ground');
            initial_ledge.scale.setTo(1, 5);
            initial_ledge.body.immovable = true;
            initial_ledge.body.velocity.x = -400;
            initial_ledge.checkWorldBounds = true;
            initial_ledge.outOfBoundsDestroy = true;

            // Multiple shorter and taller ledges
            for(var i = 0; i < 20; i++) {
                short_ledges = platforms.create(600 * i, game.world.height - 64, 'ground');
                short_ledges.scale.setTo(1, 5);
                short_ledges.body.immovable = true;
                short_ledges.body.velocity.x = -400;
                short_ledges.checkWorldBounds = true;
                short_ledges.outOfBoundsDestroy = true;

                tall_ledges = platforms.create(1200 * i, game.world.height - 120, 'ground');
                tall_ledges.scale.setTo(1, 5);
                tall_ledges.body.immovable = true;
                tall_ledges.body.velocity.x = -400;
                tall_ledges.checkWorldBounds = true;
                tall_ledges.outOfBoundsDestroy = true;
            }

            // The player and its settings
            player = game.add.sprite(300, game.world.height - 220, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            // player.body.bounce.y = 0.2;
            player.body.gravity.y = 750;
            player.body.collideWorldBounds = false;
            player.body.outofBoundsKill = true;

            if(player.body.outofBounds) {

                playerDeath();
            }

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

            //  We will enable physics for any beer that is created in this group
            beers.enableBody = true;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 100; i++)
            {
                //  Create a beer inside of the 'beers' group
                var beer = beers.create(i * 30, 450, 'beer');
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
            for(var i = 1; i <= 3; i++) {
                lives.push(game.add.sprite(16 * (i + i + i - 2), 16, 'heart'));
            }
            
            //  Our controls.
            cursors = game.input.keyboard.createCursorKeys();
            space = game.input.keyboard.addKey(32);
            shift = game.input.keyboard.addKey(16);

            // addOneLedge();
            // timer = game.time.loop(1000, addRowofLedges());

        }

        function update() {

            //  Collide the player and the beers with the platforms
            game.physics.arcade.collide(player, enemy);
            game.physics.arcade.collide(player, ledges);

            game.physics.arcade.collide(player, platforms);
            game.physics.arcade.collide(enemy, platforms);

            //  Checks to see if the player overlaps with any of the beers, if he does call the collectBeer function
            game.physics.arcade.overlap(player, beers, collectBeer);
            game.physics.arcade.overlap(player, kegs, collectKeg);

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

            if (lives.length != 0) {
                if (shift.isDown) {
                    playerHit();
                    shift.isDown = false;
                }
            }
            else {
                playerDeath();
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

        function playerHit () {
            // Removes a life from the lives array and destroys the heart sprite
            lives.pop().destroy();
        }

        function playerDeath () {
            player.animations.add('right', [0], 8, true);
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            // timer = game.time.create(1000, false);
            // timer.add(3000);
            // timer.onEvent.add(player.destroy());
            // timer.start();
        }


        // function addRowofLedges(){
        //         // Pick where the hole will be
        //         var hole = 10;

        //         // Add the 6 ledges 
        //         for (var i = 0; i < 8; i++) {
        //             if (i != hole && i != hole + 1) {
        //                 addOneLedge(i * 800, 500);   
        //             }
        //         }
        // }

        // function addOneLedge(x, y){
        //         // Get the first dead ledge of our group
        //         var ledge = ledges.getFirstDead();

        //         // Set the new position of the ledge
        //         ledge.reset(x, y);

        //         // Add velocity to the ledge to make it move left
        //         ledge.body.velocity.x = -400; 

        //         // Kill the ledge when it's no longer visible 
        //         ledge.checkWorldBounds = true;
        //         ledge.outOfBoundsKill = true;
        //         ledge.body.immovable = true;
        //     }        
        // END OF PHASER-METEOR
   }
}
