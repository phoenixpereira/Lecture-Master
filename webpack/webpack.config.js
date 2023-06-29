const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
	return {
		// Mode is forced to production because Chrome does not allow unsafe-eval in extensions.
		mode: 'production',
		entry: {
			contentScript: path.resolve(__dirname, '..', 'src', 'contentScript.ts'),
			popup: path.resolve(__dirname, '..', 'src', 'popup', 'popup.ts'),
			options: path.resolve(__dirname, '..', 'src', 'options', 'options.ts'),
		},
		output: {
			path: path.join(__dirname, '../dist'),
			filename: '[name].bundle.js',
			clean: true,
		},
		resolve: {
			extensions: ['.ts', '.js', '.css'],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
			],
		},
		plugins: [
			new CopyPlugin({
				patterns: [{ from: '.', to: '.', context: 'public' }],
			}),
			// Generate popup page
			new HtmlWebpackPlugin({
				filename: 'popup.html',
				template: 'src/popup/index.html',
				chunks: ['popup'],
			}),
			// Generate options page
			new HtmlWebpackPlugin({
				filename: 'options.html',
				template: 'src/options/index.html',
				chunks: ['options'],
			}),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
		],
	};
};
