const importFresh = require("import-fresh");
const get = require("get-value");
const objToString = require("obj-to-string");

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
    } else if (
      !this.options.beforeCreate ||
      typeof this.options.beforeCreate !== "function"
    ) {
      throw new Error(
        "Invalid `beforeCreate` option provided, it must be a function."
      );
    }
  }

  static get DEFAULTS() {
    return {
      language: "",
      pattern: /_\((.+?)(\((.+?)?\))?\)/gi,
      unmatch: "Not Found",
      beforeCreate: language => language
    };
  }

  getLanguage() {
    return importFresh(this.options.language);
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tap("after-compile", compilation => {
      compilation.fileDependencies.add(this.options.language);
    });

    compiler.hooks.compilation.tap("SimpleI18nWebpackPlugin", compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        "SimpleI18nWebpackPlugin",
        (htmlPluginData, callback) => {
          const language = this.options.beforeCreate(this.getLanguage());
          htmlPluginData.html = htmlPluginData.html.replace(
            this.options.pattern,
            (matche, $1, $2, $3) => {
              const key = $1.trim();
              const val = get(language, key, {
                default: false
              });
              if (!key || val === false) {
                return this.options.unmatch + "[" + key + "]";
              } else {
                if (typeof val === "function") {
                  const fileName = htmlPluginData.outputName;
                  if ($2 === "()") {
                    const result = val.call(language, fileName);
                    return objToString(result);
                  } else if ($3) {
                    const result = val.apply(
                      language,
                      $3.split(",").map(item => item.trim()).concat(fileName)
                    );
                    return objToString(result);
                  } else {
                    return objToString(val);
                  }
                } else {
                  return objToString(val);
                }
              }
            }
          );

          callback(null, htmlPluginData);
        }
      );
    });
  }
};
