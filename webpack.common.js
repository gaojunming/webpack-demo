const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');
module.exports.config = {
    context: path.resolve(__dirname, "src"),//用于从配置路径中解析入口起点(entry point)和 loader
    //entry: './src/index.js',//打包的入口，从它开始递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
    entry: {
        index: './js/index.js'
    },
    output: {//输出打包后的js
        filename: 'js/[name].[hash].js',//此选项决定了每个输出 bundle 的名称。注意此选项被称为文件名，但是你还是可以使用像 "js/[name]/bundle.js" 这样的文件夹结构。
        path: path.resolve(__dirname, 'dist'),//打包结果的输出目录
        publicPath: '../'//对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误
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
                            //publicPath: 'css'
                        }
                    },
                    "css-loader"
                ]
            },
            {//加载图片
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath:'img',//相对output.path
                        }
                    }
                ]
            },
            {//加载字体
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'font',//相对output.path
                        }
                    }
                ]
            },
            /*{//加载csv、tsv
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
            },*/
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
            filename: "css/[name].[hash].css"//相对output.path
        })
    ]
};
module.exports.html = {//HtmlWebpackPlugin公共配置部分
    title: "Phaser Demo",
    //favicon: "",
    //meta: {aa:"vv"},
    minify: false,
    filename: 'index.html',//相对output.path
    template: 'index.art',
    //templateParameters: { "name": "gao" },
    // chunks: ["index", "print"]//默认包含所有的chunks文件
}