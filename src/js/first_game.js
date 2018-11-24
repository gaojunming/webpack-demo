var config = {
    type: Phaser.AUTO,//type选项可以配置Phaser.CANVAS,Phaser.WEBGL,Phaser.AUTO,这是你想在游戏中使用的渲染上下文。推荐使用AUTO，会自动尝试WEBGL，如果浏览器不支持将回退到CANVAS。Phaser会自动创建一个canvas元素，附加到当前html文档中，也可以指定自己的canvas元素
    width: 800,//canvas元素的大小
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



function preload()//在游戏开始前预加载所有图像/资源
{
    this.load.image('sky', "assets/sky.png");//第一个参数是指定加载资产的key，以后创建游戏对象时使用的字符串
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}
var platforms, player, cursors, stars,bombs;
var score = 0;
var scoreText;
var gameOver;
function create() {

    this.add.image(400, 300, 'sky');//phaser3中默认情况下所有游戏对象都基于其中心定位，可以使用setOrigin更改
    //显示游戏对象的顺序与你创建它们的顺序相同，如果你先放置star它将被sky覆盖
    //this.add.image(400, 300, 'star');
    //什么是组？顾名思义，它们是您将类似对象组合在一起并将它们作为一个单元控制的方法。您还可以检查组和其他游戏对象之间的冲突
    platforms = this.physics.add.staticGroup();//创建一个新的静态物理组，arcade physics中有两种类型的物理实体：动态和静态。动态物体是可以通过速度或加速度等力量移动的物体。它可以反弹并与其他物体碰撞，并且碰撞受到身体质量和其他元素的影响。静体仅具有位置和大小。它没有受到重力的影响，你不能在它上面设置速度，当一些东西碰撞它时，它永远不会移动。

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();//调用refreshBody()是必需的，因为我们已经缩放了静态物理体，所以我们必须告诉物理世界我们所做的改变

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');



    player = this.physics.add.sprite(100, 450, 'dude');//精灵默认拥有动态物理主体
    //player.body.allowGravity=false;
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    console.log(player.body)
    this.physics.add.collider(player, platforms);//创建一个Collider对象,此对象监视两个物理对象（可包括组）并检查它们之间的冲突或重叠
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
    console.log(cursors)


    stars = this.physics.add.group({//根据配置对象创建一个动态物理组
        key: 'star',//创建一个纹理为star的孩子
        repeat: 11,//然后重复11次，所以总共会创建12个纹理为star的孩子
        setXY: { x: 12, y: 0, stepX: 70 }//设置12个孩子的位置。步长为70
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));//设置每个孩子的弹跳力为0.4~0.8之间
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);//这告诉Phaser去检查player和stars组中任何一颗星之间的重叠。如果找到，则传递给“collectStar”函数

    scoreText = this.add.text(16, 16, '得分: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
function collectStar(player, star) {
    star.disableBody(true, true);//这颗star的物理实体是禁用的，它的父游戏对象状态变为不活动和不可见的，这将从显示中移除它。
    score += 10;
    scoreText.setText('得分: ' + score);

    if (stars.countActive(true) === 0)//统计还有多少star处于活动状态
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;//忽略重力
    }
}
function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {//如果没有按键 则立即停止移动
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {//如果按键上键并且player的body的下部和另一个物体接触
        player.setVelocityY(-330);
    }
}
export default function () {
    return new Phaser.Game(config);
}