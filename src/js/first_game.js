var config = {
    type: Phaser.AUTO,//type选项可以配置Phaser.CANVAS,Phaser.WEBGL,Phaser.AUTO,这是你想在游戏中使用的渲染上下文。推荐使用AUTO，会自动尝试WEBGL，如果浏览器不支持将回退到CANVAS。Phaser会自动创建一个canvas元素，附加到当前html文档中，也可以指定自己的canvas元素
    width: 800,//canvas元素的大小
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()//前置加载资产
{
    this.load.image('sky', "assets/sky.png");//第一个参数是指定加载资产的key，以后创建游戏对象时使用的字符串
    // this.load.image('ground', 'assets/img/platform.png');
    // this.load.image('star', 'assets/img/star.png');
    // this.load.image('bomb', 'assets/img/bomb.png');
    // this.load.spritesheet('dude', 
    //     'assets/img/dude.png',
    //     { frameWidth: 32, frameHeight: 48 }
    // );
}

function create ()
{
    this.add.image(400, 300, 'sky');
}

function update ()
{
}