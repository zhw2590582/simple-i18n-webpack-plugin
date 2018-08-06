# simple-i18n-webpack-plugin
> webpack i18n plugin

## Install

```
$ npm i -D simple-i18n-webpack-plugin
```

## Usage
#### webpack.config.js
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SimpleI18nWebpackPlugin = require("simple-i18n-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

// 定义语言种类和地址
const languages = {
	zh: path.resolve("./languages/zh.json"),
	en: path.resolve("./languages/en.json")
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
				filename: language === "zh" ? "index.html" : language + "/index.html",
				template: "./index.html"
			}),
			new SimpleI18nWebpackPlugin({
				language: languages[language], // 语言路径，必填
				pattern: /_\((.*?)\)/gi, // 替换正则，选填
				unmatch: "Not Found" // 不匹配时的提示文本，选填
			})
		]
	};
});

```

#### languages/zh.json
```json
{
	"title": "标题",
	"object": {
		"object": {
			"object": "对象深度"
		}
	},
	"array": [[["数组深度"]]]
}
```

#### languages/en.json
```json
{
    "title": "title",
	"object": {
		"object": {
			"object": "object depth"
		}
	},
	"array": [[["array depth"]]]
}
```

#### src/index.html
```html
<p>_(title)</p>
<p>_(object.object.object)</p>
<p>_(array.0.0.0)</p>
<p>_(undefined)</p>
```


## Output
#### dist/index.html
```html
<p>标题</p>
<p>对象深度</p>
<p>数组深度</p>
<p>Not Found[undefined]</p>
```

#### dist/en/index.html
```html
<p>title</p>
<p>object depth</p>
<p>array  depth</p>
<p>Not Found[undefined]</p>
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)