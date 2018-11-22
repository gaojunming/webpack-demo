//输出变量方式1
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
//输出变量方式2
var firstName2 = 'Michael';
var lastName2 = 'Jackson';
var year2 = 1958;

export {firstName2, lastName2, year2};
//输出函数
export function multiply(x, y) {
    return x * y;
};
//通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。
function v1() {  }
function v2() {  }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion//函数v2使用不同的名字输出2次
};

var demo={name:"gao"}
export {demo};
//为模块指定默认输出，用在非匿名函数前也是可以的，不过函数名在模块外部是无效的。import加载的时候，视同匿名函数加载。
//一个模块只能有一个默认输出，因此export default命令只能使用一次。
//本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字
//正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。
export default function abc() {
  console.log('foo');
}