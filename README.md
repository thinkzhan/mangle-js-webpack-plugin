### 加密混淆js

```javascript
plugins: [new MangleJsClassPlugin({
  matched: /test\.js.*$/,
  algorithm: 'jjencode',
  algorithmConfig: {
    prefix: 'focus'
  }
})]
```
