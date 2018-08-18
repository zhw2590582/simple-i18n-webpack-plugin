# simple-i18n-webpack-plugin

> webpack i18n plugin (webpack i18n 多语言插件)

## Install

```
$ npm i -D simple-i18n-webpack-plugin
```

## Usage

#### webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleI18nWebpackPlugin = require('simple-i18n-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

// 定义语言种类和地址，支持json和js类型，其中js类型支持函数类型
const languages = {
	chs: path.resolve("./languages/chs.json"),
	cht: path.resolve("./languages/cht.js"),
	en: path.resolve("./languages/en.json"),
};

// 返回webpack配置数组
module.exports = Object.keys(languages).map(function(language) {
  return {
    name: language,
    mode: isProd ? 'production' : 'development',
    entry: './index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'index_bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: language === 'chs' ? 'index.html' : language + '/index.html',
        template: './index.html'
      }),
      new SimpleI18nWebpackPlugin({
        language: languages[language], // 语言路径，必填
        pattern: /_\((.*?)(\((.+?)\))?\)/gi, // 替换正则，选填
        unmatch: 'Not Found' // 不匹配时的提示文本，选填
      })
    ]
  };
});
```

#### languages/chs.json

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

#### languages/cht.js

```js
module.exports = {
  "title": "標題",
  "object": {
    "object": {
      "object": "對象深度"
    }
  },
  "array": [
    [
      ["數組深度"]
    ]
  ],
  "function": function (...arg) {
    return "函數参数測試: " + arg.join(', ');
  }
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
<p>_(object)</p>
<p>_(object.object)</p>
<p>_(object.object.object)</p>
<p>_(array)</p>
<p>_(array.0)</p>
<p>_(array.0.0)</p>
<p>_(array.0.0.0)</p>
<p>_(undefined)</p>
<p>_(function(test1, test2))</p>
```

## Output

#### dist/index.html

```html
<p>标题</p>
<p>{ object: { object: 对象深度 } }</p>
<p>{ object: 对象深度 }</p>
<p>对象深度</p>
<p>[[[数组深度]]]</p>
<p>[[数组深度]]</p>
<p>[数组深度]</p>
<p>数组深度</p>
<p>Not Found[undefined]</p>
```

#### dist/cht/index.html

```html
<p>標題</p>
<p>{ object: { object: 對象深度 } }</p>
<p>{ object: 對象深度 }</p>
<p>對象深度</p>
<p>[[[數組深度]]]</p>
<p>[[數組深度]]</p>
<p>[數組深度]</p>
<p>數組深度</p>
<p>Not Found[undefined]</p>
<p>函數参数測試: test1, test2</p>
```

#### dist/en/index.html

```html
<p>title</p>
<p>{ object: { object: object depth } }</p>
<p>{ object: object depth }</p>
<p>object depth</p>
<p>[[[array depth]]]</p>
<p>[[array depth]]</p>
<p>[array depth]</p>
<p>array depth</p>
<p>Not Found[undefined]</p>
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
