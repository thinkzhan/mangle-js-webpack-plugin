const {
  ReplaceSource
} = require('webpack-sources');
const jjencode = require('../util/jjencode');
const aaencode = require('../util/aaencode');
const algorithmMaps = {
    'jjencode': jjencode,
    'aaencode': aaencode
}

const optimize = (chunk, compilation, opts) => chunk.files.forEach((file) => {
  const originalSource = compilation.assets[file];
  const rawSource = originalSource.source();

  const {algorithm = 'jjencode', algorithmConfig = {
      prefix: '$'
  }, matched = null} = opts;

  if (matched && !file.match(matched)) {
    return;
  }

  const algorithmFunc = algorithmMaps[algorithm] || jjencode;

  let source = new ReplaceSource(originalSource);
  source.replace(0, rawSource.length - 1, algorithmFunc(rawSource, algorithmConfig.prefix));

  if (!source) {
    return;
  }
  compilation.assets[file] = source;
});

const optimizer = (compiler, compilation, opts) => (chunks) => {
  chunks.forEach((chunk) => optimize(chunk, compilation, opts));
}

module.exports = optimizer;
