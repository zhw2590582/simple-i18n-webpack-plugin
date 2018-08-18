const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SimpleI18nWebpackPlugin = require("../");
const isProd = process.env.NODE_ENV === "production";

// 定义语言种类和地址
const languages = {
	chs: path.resolve("./languages/chs.json"),
	cht: path.resolve("./languages/cht.js"),
	en: path.resolve("./languages/en.json"),
};

// 返回webpack配置数组
module.exports = Object.keys(languages).map(function(language) {
	return {
		name: language,
		mode: isProd ? "production" : "development",
		entry: "./index.js",
		output: {
			path: __dirname + "/dist",
			filename: "index_bundle.js"
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: language === "chs" ? "index.html" : language + "/index.html",
				template: "./index.html"
			}),
			new SimpleI18nWebpackPlugin({
				language: languages[language], // 语言路径，必填
				pattern: /_\((.+?)(\((.+?)\))?\)/gi, // 替换正则，选填
				unmatch: "Not Found" // 不匹配时的提示文本，选填
			})
		]
	};
});
