## 加密混淆js

支持3种加密算法：
`aaencode` `jjencode` `obfuscator JS`(默认)

### aaencode

优点：安全
缺点：加密体积大，会导致浏览器内存溢出。安卓手机尤其解析困难

适合做核心代码加密

```
ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻ //*´∇｀*/ ['_']; o=(ﾟｰﾟ) =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); (ﾟДﾟ) =(ﾟΘﾟ)= (o^_^o)/ (o^_^o);(ﾟДﾟ)={ﾟΘﾟ: '_' ,ﾟωﾟﾉ : ((ﾟωﾟﾉ==3) +'_') [ﾟΘﾟ] ,ﾟｰﾟﾉ :(ﾟωﾟﾉ+ '_') // ...
```

### jjencode
优缺点基本同aaencode

```
sojson=~[];sojson={___:++sojson,$$$$:(![]+"")[sojson],__$:++sojson,$_$_:(![]+"")[sojson],_$_:++sojson,$_$$:({}+"")[sojson],$$_$:(sojson[sojson]+"")[sojson] // ...
```

### obfuscator JS 加密

优点：轻量，数组编码+ASCII16进制。运行速度快，不可逆。

基本能对完整代码使用

本插件中依赖了[javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) 作为默认加密方式

```
var _0x9272=["\x69\x6E\x66\x6F","\x61\x64\x69\x6E\x66\x6F","\u7AD9\u957F\u63A5\u624B\u52A8\u52A0\u5BC6\uFF0C\u4FDD\u536B\u4F60\u7684\x20\x6A\x73\u3002"];(function(_0x2841x1,_0x2841x2){_0x2841x1[_0x9272[0]]= _0x9272[1];})(window, document);
```

### usage

```javascript
plugins: [new MangleJsClassPlugin()]
```

```javascript
plugins: [new MangleJsClassPlugin({
  exclude: /(manifest.*js.*$)|(bundle.*js.*$)/,
  //include: /test\.js.*$/,
  algorithm: 'obfuscator', // 'obfuscator(default)' || 'jjencode' || 'aaencode'
  algorithmConfig: {
    prefix: 'focus' // config of jjencode
    log: false // config of obfuscator 具体配置参考https://github.com/javascript-obfuscator/javascript-obfuscator
  }
})]
```

建议：用在UglifyJsPlugin之后，排除vendor文件加密
