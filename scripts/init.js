import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { readline } from 'readline';


// const FILENAME = resolve(__dirname, '../libs/qgiv/secrets.json');
const FILENAME = resolve(__dirname, '../libs/tiltify/secrets.json');
const REQUIRED_FIELDS = {
    apiKey: 'API_KEY',
};


let secrets = {};

// read existing file, if present
if (existsSync(FILENAME)) {
    secrets = require(FILENAME);
}

// initialize missing keys
Object.values(REQUIRED_FIELDS).forEach((key) => {
    if (!secrets.hasOwnProperty(key)) {
        secrets[key] = '';
    }
});

if (secrets[REQUIRED_FIELDS['apiKey']] === '') {
    // prompt for input
    const inputPrompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    inputPrompt.question('What is your API token? ', (token) => {
        secrets[REQUIRED_FIELDS['apiKey']] = token.trim();
        inputPrompt.close();
        writeFile(secrets);
    });
} else {
    writeFile(secrets);
}

process.exitCode = 0;

function writeFile () {
    // write to file
    writeFileSync(FILENAME, JSON.stringify(secrets, null, 4), { encoding: 'utf8' });
}
