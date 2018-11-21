const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
common.html.minify = {//html压缩
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: true
}
module.exports = merge(common.config, {
    mode: "production",//webpack4开始，"mode" 配置选项可以轻松切换到压缩输出，只需设置为 "production"，uglifyjs 压缩可在bundle中删除无副作用(不在sideEffects配置中的模块)模块中未使用的代码
    optimization: {//可防止entry配置多个文件引入相同的依赖模块被重复打包到各自的bundle中
        splitChunks: {
            chunks: 'all',//这里仅覆盖chunks选项,其余使用默认配置就够了
        }
    },
    plugins: [
        new OptimizeCSSAssetsPlugin({}),//css压缩
        new HtmlWebpackPlugin(common.html)//自动生成html插件
    ]
});