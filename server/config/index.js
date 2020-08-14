const path = require('path');

module.exports = {
  development: {
    sitename: 'Project Central [Development]',
    postgres: {
      options: {
        host: 'localhost',
        port: 5432,
        database: 'group11_2018',
        dialect: 'postgres',
        username: 'group11_2018',
        password: 'dHcMpwdEB5JzWUA'
      },
    },
  },
  portforward: {
    sitename: 'Project Central [PortForward]',
    postgres: {
      options: {
        host: 'localhost',
        port: 5433,
        database: 'group11_2018',
        dialect: 'postgres',
        username: 'group11_2018',
        password: 'dHcMpwdEB5JzWUA'
      },
    },
  },
  production: {
    sitename: 'Project Central',
    postgres: {
      options: {
        host: 'cspg.cs.cf.ac.uk',
        port: 5432,
        database: 'group11_2018',
        dialect: 'postgres',
        username: 'group11_2018',
        password: 'dHcMpwdEB5JzWUA'
      },
    },
  },
}