const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Relacionamentos de tabelas
Category.hasMany(Article); // Relacionamento 1-N. 1 categoria possui vários artigos
Article.belongsTo(Category); //Informa o relacionamento 1-1. 1 artigo pertence a 1 categoria



module.exports = Article;