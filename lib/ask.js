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
        case 'add' || 'modify' || 'remove':
          entry(type);
          break;
        default:
          console.error(`Illegal option ${ans.what.toUpperCase()}. Exiting...`);
          process.exit();
      }
    })
};
const entry = (type) => {
  inquirer
    .prompt([
      {
        name: 'entry',
        type: 'list',
        message: `What type of entry would you like to ${type}?`,
        options: ['Employee', 'Role', 'Department', 'Cancel']
      }
    ])
    .then(ans => {
      if (ans.entry === 'Cancel') ask();
      else require(`${ans.entry.toLowerCase()}`)(type);
    })
}

// const ask = async () => {
//   try {
//     const ans1 = await inquirer.prompt([
//       {
//         name: 'what',
//         type: 'list',
//         message: 'What would you like to do?',
//         choices: ['Add/Modify/Remove Department', 'Add/Modify/Remove Role', 'Add/Modify/Remove Employee', 'Search the database', 'Exit']
//       }
//     ])
//     if (ans1.what === 'Search the database') {
//       await search()
//     } else if (ans1.what === 'Exit') {
//       console.log('\nGoodbye!')
//       process.exit()
//     } else {
//       const ans2 = await inquirer.prompt([
//         {
//           name: 'which',
//           type: 'list',
//           message: 'Add, modify, or remove?',
//           choices: ['Add', 'Modify', 'Remove', 'Cancel']
//         }
//       ])
//       if (ans2.which === 'Cancel') ask()
//       else {
//         let trim = ans1.what.split(' ')
//         trim = trim[1]
//         await require(`./${ans2.which.toLowerCase()}.js`)(trim)
//       }
//     }
//     ask()
//   } catch (err) {
//     console.error(err)
//   }
// }

module.exports = ask
