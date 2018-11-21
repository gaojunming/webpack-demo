const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(common.config,{
    mode: "development",//webpack4开始，"mode" 配置选项可以轻松切换到压缩输出，只需设置为 "production"，uglifyjs 压缩可在bundle中删除无副作用(不在sideEffects配置中的模块)模块中未使用的代码
    devtool: 'inline-source-map',//将编译后的代码映射回原始源代码，方便调试代码，生产环境不需要
    devServer: {//配置webpack-dev-server开发服务器，如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码
        contentBase: path.resolve(__dirname, "dist"),
        compress: true,
        hot: true,//启用 webpack 的模块热替换特性
        open: false,
        port: 9000,
        proxy: {
            "/api": {
                target: "http://www.baidu.com",
                secure: false,
                //changeOrigin:true
            }
        }
    },
    plugins: [
        new webpack.NamedModulesPlugin(),//当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.HotModuleReplacementPlugin(),//启动模块热替换
        new HtmlWebpackPlugin(common.html)//自动生成html插件
    ]
});
