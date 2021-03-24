const sequelize = require('./config/connection.js')
const ask = require('./lib/ask.js')

const option = process.argv[2]

if (!option) {
  sequelize
    .sync({ force: false, logging: console.log })
    .then(() => {
      console.log('Welcome to the employeee database and tracker!')
      ask()
    })
    .catch((err) => {
      throw new Error(err)
    })
} else if (option === 'init') {
  sequelize
    .sync()
    .then(() => require('./seeds'))
}
