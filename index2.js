const models = require('./models');
const Sequelize = require('./config/connection');


Sequelize.sync({ force: false }).then(
async () => {
const roles = await models.Role.findAll({include: 'department'})
console.log(roles)
const departments = await models.Department.findAll({ include: 'department_roles' })
console.log(departments)
})