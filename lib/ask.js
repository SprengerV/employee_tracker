const inquirer = require('inquirer')
const search = require('./search.js')

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
      await search()
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
        await require(`./${ans2.which.toLowerCase()}.js`)(trim)
      }
    }
    ask()
  } catch (err) {
    console.error(err)
  }
}

module.exports = ask
