const path = require('path');
const main = require(path.join(__dirname, 'lib', 'main.js'));
const initDb = require(path.join(__dirname, 'lib', 'initDb.js'));

const option = process.argv[2]

if (!option) main();
else if (option === 'init') initDb();