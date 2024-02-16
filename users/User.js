const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

/*
Sincronizar o modelo com bd. 
force false (se não existir cria a tabela, se já existir não cria)
force true (vai criar uma nova tabela mesmo que ela já exista)
*/
User.sync({force:false}); 

module.exports = User;