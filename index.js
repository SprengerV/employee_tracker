const inquirer = require('inquirer')
const sequelize = require('./config/connection.js')
const search = require('./lib/search.js')

const option = process.argv[2]

const ask = async () => {
  try {
    const ans1 = await inquirer.prompt([
      {
        name: 'what',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add/Modify/Remove Department', 'Add/Modify/Remove Role', 'Add/Modify/Remove Employee', 'Search the database', 'Exit']
      }
    ])
    if (ans1.what === 'Search the database') {
      search()
    } else if (ans1.what === 'Exit') {
      console.log('\nGoodbye!')
      process.exit()
    } else {
      const ans2 = await inquirer.prompt([
        {
          name: 'which',
          type: 'list',
          message: 'Add, modify, or remove?',
          choices: ['Add', 'Modify', 'Remove', 'Cancel']
        }
      ])
      if (ans2.which === 'Cancel') ask()
      else {
        let trim = ans1.what.split(' ')
        trim = trim[1]
        require(`./lib/${ans2.which.toLowerCase()}.js`)(trim)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

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

module.exports = ask
