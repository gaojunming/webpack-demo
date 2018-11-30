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
    console.log("preload", this)
    this.load.image('bomb', 'assets/bomb.png');//炸弹
    
}
var points= null,curFrame=0,bomb= null;
function create() {
    console.log("create", this)
    var  p0= new Phaser.Math.Vector2(100,50);
    var  p1= new Phaser.Math.Vector2(200,60);
    var  p2= new Phaser.Math.Vector2(250,70);
    var curve= new Phaser.Curves.QuadraticBezier(p0,p1,p2);
    console.log("curve", curve);
    //console.log("getLength", curve.getLength());//获取曲线长度
    //console.log("getLengths", curve.getLengths());//获取从startPoint到endPoint的递增点(默认100个点)之间的递增长度数组;第一个元素是0,最后一个元素是曲线总长度
    var graphics= this.add.graphics();
    graphics.lineStyle(3,0x0056ff);
    curve.draw(graphics);
    //points= curve.getDistancePoints(10);//获取从startPoint到endPoint之间的所有点(结果数量根据指定的间隔距离10计算来计算)，并且每两点之间距离相差10
    //console.log("getDistancePoints",points);
    //points= curve.getPoints(100);//获取从startPoint到endPoint之间的所有点，并分成10份
    //console.log("getPoints",points);
    points= curve.getSpacedPoints(100);//和getPoints功能类型，内部实现不同，点之间距离不固定的意思？
    console.log("getSpacedPoints",points);
    bomb= this.add.image(points[0].x,points[0].y, 'bomb').setScale(1);
}

function update(time,delta) {
    console.log("time",time,"delta",delta)
    //console.log("update",this)
    curFrame++;
    if(curFrame> points.length-1){
        curFrame= 0;
    }
    bomb.setPosition(points[curFrame].x,points[curFrame].y);
}

export default function () {
    return new Phaser.Game(config);
}