/*编译时加载 */
import '../css/style.css';
import $ from 'jquery';//如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。
import phaser from 'phaser';//import语句会执行所加载的模块，省略输入的变量名可以仅仅执行模块，不会输入任何值。多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

import {firstName, lastName, year} from './module_export_demo.js';//js后缀可省略
console.log("import",firstName,lastName,year);
import { lastName as surname } from './module_export_demo.js';
console.log("import",surname);
import {demo} from './module_export_demo.js';
console.log("demo",demo);
//建议凡是输入的变量，都当作完全只读，轻易不要改变它的属性。
demo.name="jun"//import命令输入的变量都是只读的，因为它的本质是输入接口。如果输入接口是一个对象，改写输入变量的属性是允许的，可以成功改写，并且其他模块也可以读到改写后的值。
console.log("demo",demo);
import * as mDemo from './module_export_demo.js';//模块的整体加载，模块整体加载所在的那个对象不允许运行时改变
console.log("mDemo",mDemo);
import defDemo from './module_export_demo.js';//加载含有默认输出的模块时，import命令可以为该输入指定任意名字。这时import命令后面，不使用大括号。
console.log("defDemo",defDemo);
//如果想在一条import语句中，同时输入默认方法和其他接口，可以写成下面这样。
import defDemo, { lastName } from './module_export_demo.js';//大括号内对应非默认输出
/*export 与 import 的复合写法 */
//先输入再输出同一个模块，但需要注意的是，写成一行以后，foo和bar实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。
export { foo, bar } from './module_export_demo.js';
// 接口改名
export { foo as myFoo } from './module_export_demo.js';
// 整体输出
export * from './module_export_demo.js';//注意，export *命令会忽略目标模块的default方法
//默认接口的写法如下
export { default } from './module_export_demo.js';
//具名接口改为默认接口的写法如下。
export { es6 as default } from './module_export_demo.js';
// 等同于
import { es6 } from './module_export_demo.js';
export default es6;
//同样地，默认接口也可以改名为具名接口。
export { default as es6 } from './module_export_demo.js';

/*动态(运行时)加载 https://es6.ruanyifeng.com/#docs/module#import*/
//动态加载 需要了解Promise对象https://es6.ruanyifeng.com/#docs/promise，暂时用不到动态加载，目前静态加载足够了