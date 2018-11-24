// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// our game's configuration
let config = {
    type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
    width: 640, // game width
    height: 360, // game height
    scene: gameScene // our newly created scene
};

// create the game, and pass it the configuration
//let game = new Phaser.Game(config);
// load asset files for our game
gameScene.preload = function () {

    // load images
    this.load.image('background', 'assets/crossy/background.png');
    this.load.image('player', 'assets/crossy/player.png');
    this.load.image('dragon', 'assets/crossy/dragon.png');
    this.load.image('treasure', 'assets/crossy/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function () {

    // background
    let bg = this.add.sprite(0, 0, 'background');
    // change origin to the top-left of the sprite
    bg.setOrigin(0, 0);

    // player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');//this.sys.game.config启动游戏时定义的配置

    // scale down
    this.player.setScale(0.5);
    console.log(this.sys)
    console.log(this)

    // goal
    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
    this.treasure.setScale(0.6);

    // group of enemies
    this.enemies = this.add.group({
        key: 'dragon',
        repeat: 5,
        setXY: {
            x: 110,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });
    // scale enemies
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);//Phaser.Actions。ScaleXY是一个实用工具，它可以将缩放值降低0.5到传入的所有精灵。

    // set speeds
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {//Phaser.Actions.Call允许我们对每个数组元素调用一个方法,并使用第二个参数作为上下文对象
        enemy.speed = Math.random() * 2 + 1;//为每个龙提供1到2之间的随机速度
    }, this);

    // player is alive
    this.isPlayerAlive = true;
    // reset camera effects
    //this.cameras.main.fade(250)执行后即使在重新启动场景后，此效果也会使游戏变黑，因此我们需要调用this.cameras.main.resetFX（）; 要恢复正常，为此，将其添加到create方法的底部，否则重新启动场景后屏幕将保持黑色：
    //经测试重启场景并不存在黑屏，可能phaser新版本修复了此问题
    //this.cameras.main.resetFX();
}

// executed on every frame (60 times per second)
gameScene.update = function () {
    // only if the player is alive
    if (!this.isPlayerAlive) {
        return;
    }
    // check for active input
    if (this.input.activePointer.isDown) {
        // player walks
        this.player.x += this.playerSpeed;
    }
    // treasure collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {//如果两个矩形都经过重叠，Phaser.Geom.Intersects.RectangleToRectangle将返回true
        this.gameOver();
    }


    // enemy movement
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        // move enemies
        enemies[i].y += enemies[i].speed;

        // reverse movement if reached the edges
        if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
            enemies[i].speed *= -1;
        } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
            enemies[i].speed *= -1;
        }

        // enemy collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }

};
// some parameters for our scene (our own customer variables - these are NOT part of the Phaser API)
gameScene.init = function () {//在preload方法之前调用
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
}
// end the game
gameScene.gameOver = function () {

    // restart the scene
    //this.scene.restart();
    // flag to set player is dead
    this.isPlayerAlive = false;
    // shake the camera
    this.cameras.main.shake(500);//相机将晃动500毫秒
    // fade camera
    this.time.delayedCall(250, function () {//在250毫秒时，我们开始淡出效果，持续250毫秒。
        this.cameras.main.fade(250);
    }, [], this);
    // restart game
    this.time.delayedCall(500, function () {//在500毫秒后，我们使用this.time.delayCall重新启动场景，它允许您在一段时间后执行一个方法
        this.scene.restart();
    }, [], this);
}
export default function () {
    return new Phaser.Game(config);
}