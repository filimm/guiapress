const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

//Importação dos controllers para a aplicação incorporar as rotas criadas dentro dos controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

// Importação dos models para a aplicação fazer as interações com o BD
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//View Engine - Define a biblioteca que vai renderizar html no node
app.set('view engine', 'ejs');

//Sessions
app.use(session({
  secret: "qualquercoisa",
  cookie: {maxAge: 30000000}
}))


//Body Parser - Captura dados de formulários
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static - Define o local onde ficarão os arquivos estáticos (css, img, js)
app.use(express.static('public'));

//Database
connection
  .authenticate()
  .then(() => {
    console.log('conexão com o bd feita com o sucesso')
  }).catch((error) => {
    console.log(error);
  });

//forma de adicionar as rotas dos controllers na aplicação principal
//é possível colocar prefixos depois da /  
app.use('/',categoriesController);
app.use('/',articlesController);
app.use('/',usersController);

//listar artigos na home
app.get('/', (req, res) => {
  Article.findAll({
    order:[
      ['id','DESC'],
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index',{articles: articles, categories: categories});
    }).catch(err => {
      res.redirect('/');
    })
    
  });
  
});


//rota para acessar um artigo
app.get('/:slug', (req,res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        res.render('article',{article: article , categories: categories});
      }); 
    } else {
      res.redirect('/');   
    }
  }).catch(err => {
    res.redirect('/');
  })
})

//rota para listar artigos de um categoria
app.get('/category/:slug', (req,res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}] // join da tabela categorias com a tabela article
  }).then(category => {
    if (category != undefined) {
      Category.findAll().then(categories => {
        res.render('index',{articles: category.articles, categories: categories});
      });
    } else {
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  })

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});