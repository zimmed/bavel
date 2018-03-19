
require('babel-polyfill');
const path = require('path');
const fs = require('fs');
const register = require('babel-core/register');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mock = require('mock-require');
const BabylonJS = require('./babylonjs.mock');

chai.use(sinonChai);

const BABEL_RC_PATH = path.resolve(__dirname, '../.babelrc');
const NULL_EXTS = ['css', 'png', 'jpg', 'gif'];
const GLOBALS = {
	__TEST__: true,
	__DEV__: true,
	sandbox: sinon.createSandbox(),
	expect: chai.expect,
	sinon,
  mock,
  BabylonJS,
  when: (desc, func) => describe(`when ${desc}`, func),
  wait: (timeoutMs=1) => new Promise(res => setTimeout(() => res(), timeoutMs >= 1 ? timeoutMs : 1)),
};
const MOCKS = {
	'babylonjs': BabylonJS
};

setupTestEnv();

// Setup definition -- changes not necessary
function setupTestEnv() {
	const config = JSON.parse(fs.readFileSync(BABEL_RC_PATH));

	register(config);
	Object.assign(global, GLOBALS);
	NULL_EXTS.forEach(ext => require.extensions[`.${ext}`] = nullModule);

	Object.keys(MOCKS).forEach(moduleName => mock(moduleName, MOCKS[moduleName]));

	function nullModule() {
		module.exports = null;
	}
}
