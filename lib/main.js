const inquirer = require('inquirer');
const { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } = require('node:constants');

inquirer 
    .prompt([
        {
            name: 'open',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Search employee database', 'Update employee database'],
        },
    ])
    .then((ans) => {
        switch (ans.open) {
            case 'Search employee database':
                search();
                break
            case 'Update employee database':
                update();
                break
            default:
                console.log(`Invalid operation: '${ans.open}'`)
        }
    })
    .catch((err) => {
        if (err) throw new Error(err)
    })