const Sequelize = require('sequelize');

//Conexão com banco de dados [bd - login - senha]
const connection = new Sequelize('guiapress', 'root', 'Akronmatenko183!',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})

module.exports = connection;