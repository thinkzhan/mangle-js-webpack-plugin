var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var rimraf = require('rimraf');
var webpackMajorVersion = Number(require('webpack/package.json').version.split('.')[0]);
if (webpackMajorVersion < 4) {
  var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
}
const MangleJsClassPlugin = require('../index.js');

const OUTPUT_DIR = path.join(__dirname, '../dist');

const testPlugin = (webpackConfig, expectedResults, done, expectErrors, expectWarnings) => {
  if (webpackMajorVersion >= 4) {
    webpackConfig.mode = 'development';
    if (webpackConfig.module && webpackConfig.module.loaders) {
      webpackConfig.module.rules = webpackConfig.module.loaders;
      delete webpackConfig.module.loaders;
    }
  }
  if (webpackConfig.__commonsChunk) {
    if (webpackMajorVersion < 4) {
      webpackConfig.plugins = webpackConfig.plugins || [];
      webpackConfig.plugins.unshift(new CommonsChunkPlugin(webpackConfig.__commonsChunk));
    } else {
      webpackConfig.optimization = transformCommonChunkConfigToOptimization(webpackConfig.__commonsChunk);
    }
    delete webpackConfig.__commonsChunk;
  }
  webpack(webpackConfig, (err, stats) => {
    expect(err).toBeFalsy();
    var compilationErrors = (stats.compilation.errors || []).join('\n');
    if (expectErrors) {
      expect(compilationErrors).not.toBe('');
    } else {
      expect(compilationErrors).toBe('');
    }
    var compilationWarnings = (stats.compilation.warnings || []).join('\n');
    if (expectWarnings) {
      expect(compilationWarnings).not.toBe('');
    } else {
      expect(compilationWarnings).toBe('');
    }
    var outputFileExists = fs.existsSync(path.join(OUTPUT_DIR, webpackConfig.output.filename));
    expect(outputFileExists).toBe(true);
    if (!outputFileExists) {
      return done();
    }
    var content = fs.readFileSync(path.join(OUTPUT_DIR, webpackConfig.output.filename)).toString();
    for (var i = 0; i < expectedResults.length; i++) {
      var expectedResult = expectedResults[i];
      if (expectedResult instanceof RegExp) {
        expect(content).toMatch(expectedResult);
      } else {
        expect(content).toContain(expectedResult);
      }
    }
    done();
  });
}

describe('MangleJsClassPlugin', () => {
  beforeEach((done) => {
    rimraf(OUTPUT_DIR, done);
  });

  it('use specific algorithm', (done) => {
    testPlugin({
      entry: [path.join(__dirname, 'fixtures/case1.js')],
      output: {
        path: OUTPUT_DIR,
        filename: 'case1.js',
      },
      plugins: [new MangleJsClassPlugin({
        algorithm: 'aaencode'
      })]
  }, ['ﾟωﾟﾉ= /｀ｍ´）'], done);
  });

  it('match include file with jjencode config', (done) => {
    testPlugin({
      entry: path.join(__dirname, 'fixtures/case2.js'),
      output: {
        path: OUTPUT_DIR,
        filename: 'case2.js'
      },
      plugins: [new MangleJsClassPlugin({
        include: /case2\.js.*$/,
        algorithm: 'jjencode',
        algorithmConfig: {
          prefix: 'focus'
        }
      })]
    }, ['focus.$$$'], done);
  });

  it('ignore excluded file', (done) => {
    testPlugin({
      entry: path.join(__dirname, 'fixtures/case3.js'),
      output: {
        path: OUTPUT_DIR,
        filename: 'case3.js'
      },
      plugins: [new MangleJsClassPlugin({
        exclude: /case3\.js.*$/
      })]
  }, ['installedModules[moduleId]'], done);
  });

  it('use default config', (done) => {
    testPlugin({
      entry: path.join(__dirname, 'fixtures/case3.js'),
      output: {
        path: OUTPUT_DIR,
        filename: 'case3.js'
      },
      plugins: [new MangleJsClassPlugin()]
  }, ['_0x'], done);
  });
});
