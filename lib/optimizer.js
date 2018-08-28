const {
  ReplaceSource
} = require('webpack-sources');
const jjencode = require('../util/jjencode');
const aaencode = require('../util/aaencode');
const obfuscator = require('javascript-obfuscator').obfuscate;

const algorithmMaps = {
  'jjencode': jjencode,
  'aaencode': aaencode,
  'obfuscator': obfuscator
}

const optimize = (chunk, compilation, opts) => chunk.files.forEach((file) => {
  const originalSource = compilation.assets[file];

  const {
    algorithm = 'obfuscator', algorithmConfig = {
    }, include = null, exclude = null
  } = opts;

  if (!file.match(/.*\.js.*$/)) {
    return;
  }

  // exclude > include
  if (exclude) {
    if (file.match(exclude)) {
      return;
    }
  } else if (include && !file.match(include)) {
    return;
  }

  const rawSource = originalSource.source();

  const algorithmFunc = algorithmMaps[algorithm] || obfuscator;

  let trans = algorithmFunc(rawSource, algorithmConfig).getObfuscatedCode();

  let source = new ReplaceSource(originalSource);
  source.replace(0, rawSource.length - 1, trans);

  if (!source) {
    return;
  }
  compilation.assets[file] = source;
});

const optimizer = (compiler, compilation, opts) => (chunks) => {
  chunks.forEach((chunk) => optimize(chunk, compilation, opts));
}

module.exports = optimizer;
