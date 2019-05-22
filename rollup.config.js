const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

const isBrowserOutput = String(process.env.NODE_ENV).includes('browser');

module.exports = {
	input: 'src/index.js',
	output: isBrowserOutput
		? { file: 'browser.js', format: 'iife', name: 'elementMerge', strict: false }
	: [
		{ file: 'index.js', format: 'cjs', strict: false },
		{ file: 'index.mjs', format: 'esm', strict: false }
	],
	plugins: [
		babel()
	].concat(isBrowserOutput
		? [
			terser({
				compress: {
					unsafe: true
				}
			}),
			compressIIFE()
		]
	: [])
};

function compressIIFE () {
	return {
		name: 'compress-iife',
		renderChunk (code, chunk, options) {
			if (options.format === 'iife') {
				const xRegExp1 = new RegExp(`^(?:var ${options.name}=function\\(\\){return function)(\\([\\W\\w]+})(?:}\\(\\);)$`);

				if (xRegExp1.test(code)) {
					const [, body] = code.match(xRegExp1);

					const newCode = `function ${options.name}${body}`;

					return newCode;
				}

				const xRegExp2 = new RegExp(`^var ${options.name}`);

				if (xRegExp2.test(code)) {
					const newCode = code.replace(xRegExp2, options.name);

					return newCode;
				}
			}

			return null;
		}
	};
}
