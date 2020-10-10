const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
    entry: {
        app: "./src/app.js"
    },
    resolve: {
        alias: { src: path.resolve(__dirname, "../src") }
    },

    output: {
        // path: path.resolve(__dirname, '../dist'),
        path: path.resolve(__dirname, "/var/www/html"),
        filename: "bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, "../src/static")
                ],
                loader: "file-loader"
            },
            {
                test: /\.(ttf|eot|webp|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.html$/i,
                include: [
                    path.resolve(__dirname, "../src/component")
                ],
                loader: "html-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template/index.html",
            favicon: "./src/assets/app_logo.png",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/template/team-info.html",
            favicon: "./src/assets/app_logo.png",
            filename: "team-info.html"
        }),

        new webpack.ProvidePlugin({
            "window.jQuery": "jquery",
            "window.$": "jquery",
            jQuery: "jquery",
            $: "jquery"
        }),

        new WebpackPwaManifest({
            name: "My App",
            short_name: "My App",
            description: "My App",
            start_url: ".",
            display: "standalone",
            background_color: "#FFFFFF",
            theme_color: "#2196F3",
            crossorigin: "use-credentials",
            ios: true,
            icons: [
                {
                    src: path.resolve("./src/assets/app_logo.png"),
                    sizes: [96, 128, 512]
                }
            ],
            gcm_sender_id: "908740532940"
        }),

        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, "../src/sw.js"),
            filename: "sw.js"
        }),

        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ],

    performance: {
        hints: process.env.NODE_ENV === "production" ? "warning" : false
    },

    devtool: "source-map"
}
