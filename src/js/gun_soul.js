/*game：枪魂*/
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.image('sky', "assets/sky.png");//天空背景
    this.load.image('ground', 'assets/platform.png');//地面
    this.load.image('star', 'assets/star.png');//星星
    this.load.image('bomb', 'assets/bomb.png');//炸弹
    this.load.spritesheet('dude',//主角
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }//每帧的宽/高
    );
}
var platform, //平台
    player, //主角
    cursors;//按键游标



var graphics;

function create() {
    console.log("this", this)
    //this.add.image(400, 300, 'sky');
    platform = this.add.image(400, 568, 'ground')//.setScale(2);
    player = this.add.sprite(400, 300, 'dude');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    cursors = this.input.keyboard.createCursorKeys();//创建并返回一个包含4个热键的对象，包括向上，向下，向左和向右，以及空格键和移位。




    graphics = this.add.graphics();


}


var isJump = false,//跳跃状态
    speed = 6,//速度
    jump = 0,//跳跃递增值
    maxJump = 80,//最大跳跃高度
    isAttack = false,//攻击状态
    distance = 0,//子弹距离递增值
    attackSpeed = 10,//子弹速度
    maxDistance = 300,//攻击最大距离
    direction = true,//角色方向，默认true表示right，false表示left
    isThrow = false;
var bomb;
var dan;
var path = { t: 0, vec: new Phaser.Math.Vector2() };
var curve;
var px, py;
function update() {
    if (cursors.shift.isDown && !isThrow) {//手榴弹
        console.log("run..")
        isThrow = true;
        dan = this.add.image(player.x - attackSpeed, player.y, 'bomb').setScale(2);
        px = player.x;
        py = player.y;
        if (cursors.left.isDown) {
            curve = new Phaser.Curves.CubicBezier(new Phaser.Math.Vector2(px, py), new Phaser.Math.Vector2(px - 20, py - 20), new Phaser.Math.Vector2(px - 50, py - 100), new Phaser.Math.Vector2(px - 200, this.sys.game.config.height));
        } else {
            curve = new Phaser.Curves.CubicBezier(new Phaser.Math.Vector2(px, py), new Phaser.Math.Vector2(px + 20, py - 20), new Phaser.Math.Vector2(px + 50, py - 100), new Phaser.Math.Vector2(px + 200, this.sys.game.config.height));
        }
    }
    if (isThrow) {
        //graphics.clear();
        //graphics.lineStyle(1, 0x00ff00, 1);
        //curve.draw(graphics);
        curve.getPoint(path.t, path.vec);
        if (path.t <= 1) {
            path.t += 0.05;
            dan.x = path.vec.x;
            dan.y = path.vec.y;
            if (Phaser.Geom.Intersects.RectangleToRectangle(dan.getBounds(), platform.getBounds())) {
                dan.destroy();
            }
        } else {
            path.t = 0;
            isThrow = false;
        }

    }


    if (cursors.down.isDown && !isAttack) {//攻击
        isAttack = true;
        if (cursors.left.isDown) {
            bomb = this.add.image(player.x - attackSpeed, player.y, 'bomb').setScale(0.8);
            direction = false;
        } else {
            bomb = this.add.image(player.x + attackSpeed, player.y, 'bomb').setScale(0.8);
            direction = true;
        }

    }
    if (isAttack) {
        if (distance < maxDistance) {
            distance += attackSpeed
            if (direction) {
                bomb.x += attackSpeed;
            } else {
                bomb.x -= attackSpeed;
            }
        } else {
            distance = 0;
            isAttack = false;
            bomb.destroy();
        }
    }
    if (cursors.left.isDown) {
        player.x -= speed / 2 + 1;
        if (!Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), platform.getBounds()) && !isJump) {
            player.y += speed;
        }
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.x += speed / 2 + 1;
        if (!Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), platform.getBounds()) && !isJump) {
            player.y += speed;
        }
        player.anims.play('right', true);
    }
    else {
        if (!Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), platform.getBounds()) && !isJump) {
            player.y += speed;
        }
        player.anims.play('turn');
    }

    if (cursors.up.isDown) {
        isJump = true;
    }
    if (isJump) {
        if (jump < maxJump) {
            jump += speed;
            player.y -= speed;
        } else {
            if (!Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), platform.getBounds())) {
                player.y += speed;
            } else {
                jump = 0;
                isJump = false;
            }
        }

    }
}
export default function () {
    return new Phaser.Game(config);
}