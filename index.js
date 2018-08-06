const importFresh = require("import-fresh");
const get = require("get-value");

module.exports = class SimpleI18nWebpackPlugin {
	constructor(options) {
		this.options = Object.assign({}, SimpleI18nWebpackPlugin.DEFAULTS, options);
		if (
			!this.options.pattern ||
			Object.prototype.toString.call(this.options.pattern) !== "[object RegExp]"
		) {
			throw new Error(
				"Invalid `pattern` option provided, it must be a valid regex."
			);
		} else if (
			!this.options.language ||
			typeof this.options.language !== "string"
		) {
			throw new Error(
				"Invalid `language` option provided, it must be a object."
			);
		} else if (
			!this.options.unmatch ||
			typeof this.options.unmatch !== "string"
		) {
			throw new Error(
				"Invalid `unmatch` option provided, it must be a string."
			);
		}
	}

	static get DEFAULTS() {
		return {
			language: "",
			pattern: /_\((.*?)\)/gi,
			unmatch: "Not Found"
		};
	}

	getLanguage() {
		return importFresh(this.options.language);
	}

	apply(compiler) {
		compiler.hooks.afterCompile.tap('after-compile', compilation => {
			compilation.fileDependencies.add(this.options.language);
		});

		compiler.hooks.compilation.tap("SimpleI18nWebpackPlugin", compilation => {
			compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
				"SimpleI18nWebpackPlugin",
				(htmlPluginData, callback) => {
					const language = this.getLanguage();
					htmlPluginData.html = htmlPluginData.html.replace(
						this.options.pattern,
						($1, $2, $3) => {
							const key = $2.trim();
							const val = get(language, key);
							if (!key || !val) {
								return this.options.unmatch + "[" + key + "]";
							} else {
								return val;
							}
						}
					);
					callback(null, htmlPluginData);
				}
			);
		});
	}
};
