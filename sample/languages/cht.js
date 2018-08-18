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
