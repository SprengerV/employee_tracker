const Department = require('../models').Department
const Role = require('../models').Role
const Employee = require('../models').Employee

Department.create({ name: 'Accounting' })
Department.create({ name: 'Shipping' })
Department.create({ name: 'IT' })
Department.create({ name: 'Human Resources' })

Role.create(
  {

  })
