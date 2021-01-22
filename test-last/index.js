const path = require('path');
const fs = require('fs');

const specs = path.join(__dirname, '..', 'specs');

const files = [];

const rec = dir => {

    fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {

        const fullPath = path.join(dir, file.name);

        const isDir = fs.lstatSync(fullPath).isDirectory();
        const isFile = fs.lstatSync(fullPath).isFile();

        const stats = fs.statSync(fullPath);

        if (isFile) {

            files.push({ fullPath, updated: stats.mtime });
        }

        if (isDir) rec(fullPath);
    });
};

rec(specs);

files.sort((a, b) => a.updated - b.updated);

const last = files.pop();

const parcialPath = last.fullPath.slice(specs.length).replace(/\\/g, '/');

console.log({ parcialPath });
console.log();

// ./node_modules/mocha/bin/_mocha --require module-alias/register ./specs/scripts/eases/-pokerhand.spec.js

// #region sendkeys-js

// const sendkeys = require('sendkeys-js');

// const command = './node_modules/mocha/bin/_mocha --require module-alias/register ./specs' + parcialPath;

// sendkeys.send(command + '{enter}');

// //#endregion


// ? Funciona mas não tem cor no termimal
// #region child_process

/* const { exec } = require("child_process");

exec('mocha --require module-alias/register ' + last.fullPath, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
 */
//#endregion


const spawn = require('child_process').spawn;

// const command = 'mocha --require module-alias/register ' + last.fullPath;

const command = 'mocha ' + last.fullPath;


// const cmd = spawn('cmd', ['/s', '/c', command], { customFds: [0, 1, 2] });
// (node:12604) [DEP0006] DeprecationWarning: child_process: options.customFds option is deprecated. Use options.stdio instead.
// https://nodejs.org/api/child_process.html#child_process_options_stdio

const cmd = spawn('cmd', ['/s', '/c', command], { stdio: 'inherit' });

cmd.on('exit', function (code) { });