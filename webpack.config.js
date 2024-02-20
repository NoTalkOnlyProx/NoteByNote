const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const {createSveltePreprocessor} = require("./svelte.config");
const PathsPlugin = require("tsconfig-paths-webpack-plugin").default;

module.exports = {
    // This says to webpack that we are in development mode and write the code in webpack file in different way
    mode: 'development',
    entry: {
        'challenge_b': './src/challenges/challenge_b.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.svelte$/,
                loader: 'svelte-loader',
                options: {
                    emitCss: false,
                    preprocess: createSveltePreprocessor(),
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                use: 'file-loader',
            },
            {
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte/src/runtime'),
        },
        extensions: [".mjs", ".js", ".ts", ".svelte"],
        mainFields: ["svelte", "browser", "module", "main"],
        plugins: [
            new PathsPlugin({
                extensions: [".mjs", ".js", ".ts", ".svelte"],
            }),
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/challenges/challenge_b.html'),
            filename: "[name].html",
        }),
        //This gets all our css and put in a unique file
        new MiniCssExtractPlugin(),
    ],
};
