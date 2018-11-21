const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');
module.exports.config = {
    //entry: './src/index.js',//打包的入口，从它开始递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
    entry: {
        index: './src/js/index.js'
    },
    output: {//输出打包后的js
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        //publicPath: '127.0.0.1:8080/abc/'
    },
    module: {//注意：加载json是内置支持的
        rules: [
            {//加载css
                test: /\.css$/,
                /*use: [//多个loader按相反的顺序执行
                    'style-loader',//html中插入css style标签，注意css样式表内容被打包在js文件中
                    'css-loader'//加载css资源
                ],*/
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            //publicPath: '../'
                        }
                    },
                    "css-loader"
                ]
            },
            {//加载图片
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {//加载字体
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {//加载csv、tsv
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {//加载xml
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },
            {//加载art-template模板
                test: /\.art$/,
                loader: "art-template-loader",
                options: {
                    // art-template options (if necessary)
                    // @see https://github.com/aui/art-template
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),//在每次构建前清理 /dist 文件夹
        new ManifestPlugin(),//用于生成资产清单的Webpack插件，关于manifest：https://www.webpackjs.com/guides/output-management/#manifest
        new MiniCssExtractPlugin({//将CSS提取到单独的文件中
            filename: "[name].[hash].css"
        })
    ]
};
module.exports.html = {//HtmlWebpackPlugin公共配置部分
    title: "首页",
    favicon: "",
    meta: {},
    minify: false,
    filename: 'index.html',
    template: 'src/tmp/index.art',
    templateParameters: { "name": "gao" },
    // chunks: ["index", "print"]//默认包含所有的chunks文件
}