const {
  ReplaceSource
} = require('webpack-sources');

const algorithmMaps = require('../util/algorithmMaps');

const optimize = (chunk, compilation, opts) => chunk.files.forEach((file) => {
  const originalSource = compilation.assets[file];

  const {
    algorithm = 'obfuscator', algorithmConfig = {}, include = null, exclude = null
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
  const source = new ReplaceSource(originalSource);

  const algorithmFunc = algorithmMaps[algorithm] || algorithmMaps['obfuscator'];
  const trans = algorithmFunc(rawSource, algorithmConfig).getObfuscatedCode();

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
