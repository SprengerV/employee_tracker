const sequelize = require('./config/connection.js');
const ask = require('./lib/ask.js');
const Models = require('./models');

const option = process.argv[2];

if (!option) {
  sequelize
    .sync({ force: false, logging: false })
    .then(() => {
      console.log('Welcome to the employeee database and tracker!');
      ask();
    })
    .catch(err => console.error(err));
} else if (option === 'init') {
  sequelize
    .sync()
    .then(() => require('./seeds'))
    .catch(err => console.error(err));
} else {
  console.log(`Invalid option ${option.toUpperCase()}`);
}
