const jjencode = require('./jjencode');
const aaencode = require('./aaencode');
const obfuscator = require('javascript-obfuscator').obfuscate;

module.exports = {
  'jjencode': jjencode,
  'aaencode': aaencode,
  'obfuscator': obfuscator
}
