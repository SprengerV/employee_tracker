const Department = require('../models/Department.js');
const Role = require('../models/Role.js');
const Employee = require('../models/Employee.js');

Department.create({ name: 'Accounting' });
Department.create({ name: 'Administration' });
Department.create({ name: 'IT' });
Department.create({ name: 'Human Resources' });

Role.create(
    {
        
    })

module.exports = initDb;