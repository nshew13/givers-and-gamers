const fs = require('fs');
const path = require('path');

const FILENAME = path.resolve(__dirname, './qgiv/secrets.json');
// const FILENAME = './qgiv/secrets.json';
const SKELETON_KEYS = [
	'QGIV_API_KEY',
];

let secrets = {};

// read existing file, if present
if (fs.existsSync(FILENAME)) {
	secrets = require(FILENAME);
}

// initialize missing keys
SKELETON_KEYS.forEach((key) => {
	if (!secrets.hasOwnProperty(key)) {
		secrets[key] = '';
	}
});

// write to file
fs.writeFileSync(FILENAME, JSON.stringify(secrets, null, 4), { encoding: 'utf8' });
