const fs = require('fs');
const path = require('path');


const FILENAME = path.resolve(__dirname, './qgiv/secrets.json');
const SKELETON_KEYS = [
	'QGIV_API_KEY', // order currently matters
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

if (secrets[SKELETON_KEYS[0]] === '') {
    const readline = require('readline');

    // prompt for input
    const inputPrompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    inputPrompt.question('What is your Qiv API token? ', (token) => {
        secrets[SKELETON_KEYS[0]] = token.trim();
        inputPrompt.close();
        writeFile(secrets);
    });
} else {
    writeFile(secrets);
}

process.exitCode = 0;

function writeFile () {
    // write to file
    fs.writeFileSync(FILENAME, JSON.stringify(secrets, null, 4), { encoding: 'utf8' });
}
