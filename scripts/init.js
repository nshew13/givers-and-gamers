import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readlinePromises from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILENAME = path.resolve(__dirname, '../src/components/tiltify/secrets.json');
const REQUIRED_FIELDS = {
    apiKey: 'API_KEY',
};


let secrets = {};

// read existing file, if present
if (existsSync(FILENAME)) {
    console.error('Configuration file already exists.');
    process.exit(1);

    // secrets = await import(FILENAME, {
    //     assert: {
    //         type: "json",
    //     },
    // });
}

// initialize missing keys
Object.values(REQUIRED_FIELDS).forEach((key) => {
    if (!secrets.hasOwnProperty(key)) {
        secrets[key] = '';
    }
});

if (secrets[REQUIRED_FIELDS['apiKey']] === '') {
    // prompt for input
    const inputPrompt = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await inputPrompt.question('What is your API token? ').then(
        (token) => {
            secrets[REQUIRED_FIELDS['apiKey']] = token.trim();
            inputPrompt.close();
            writeFile(secrets);
        }
    );
} else {
    writeFile(secrets);
}

process.exit(0);

function writeFile () {
    // write to file
    writeFileSync(FILENAME, JSON.stringify(secrets, null, 4), { encoding: 'utf8' });
}
