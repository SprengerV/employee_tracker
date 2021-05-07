const inquirer = require('inquirer')

const ask = () => {
  inquirer
    .prompt([
      {
        name: 'what',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add an entry', 'Modify an entry', 'Remove an entry', 'Search the database', 'Exit']
      }
    ])
    .then(ans => {
      const split = ans.what.split(' ');
      const type = split[0].toLowerCase();
      switch (type) {
        case 'exit':
          console.log('\nGoodbye!');
          process.exit();
        case 'search':
          require('search');
          break;
        case 'add':
        case 'modify':
        case 'remove':
          entry(type);
          break;
        default:
          console.error(`Illegal option ${ans.what.toUpperCase()}. Exiting...`);
          process.exit();
      }
    })
    .catch(err => console.error(err));
};
const entry = (type) => {
  inquirer
    .prompt([
      {
        name: 'entry',
        type: 'list',
        message: `What type of entry would you like to ${type}?`,
        choices: ['Employee', 'Role', 'Department', 'Cancel']
      }
    ])
    .then(ans => {
      if (ans.entry === 'Cancel') ask();
      else require(`./${type}`)[type](ans.entry.toLowerCase());
    })
    .catch(err => console.error(err));
}

module.exports = ask;
