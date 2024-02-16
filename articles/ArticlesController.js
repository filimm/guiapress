const express = require('express');
const router = express.Router(); // para diferenciar controllers do principal usa a constante router
const Category = require('../categories/Category');
const Article = require('../articles/Article');
const slugify = require('slugify'); // biblioteca que transaforma titulos em slug
const adminAuth = require('../middleware/adminAuth');

//criação de rotas em arquivos diferentes do index.js
router.get('/admin/articles', adminAuth ,(req,res) => {
    Article.findAll({
        include: [{model: Category}] //criação do join entre tabelas
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles});
    })
});

router.get('/admin/articles/new', adminAuth, (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories});
    })
    
});

router.post('/articles/save',(req,res) =>{
    var title = req.body.title;
    var content = req.body.content;
    var category = req.body.category;
    Article.create({
        title: title,
        slug: slugify(title, {
            lower:true
        }),
        content: content,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    })
})

//Rota para exclusão de artigo. O método do roteamente tem que ser post.
router.post('/articles/delete',(req,res) => {
    var id = req.body.id; // captura o input com name id do formulario
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({ //método do sequelize para excluir uma linha
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            })
            
        } else {
            res.redirect('/admin/articles');
        }
        
    } else {
            res.redirect('/admin/articles');
    }
})

router.get('/admin/articles/edit/:id', (req,res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Article.findByPk(id).then(article =>{
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit',{article: article, categories: categories});
            })

            
        } else {
            res.redirect('/admin/articles');
        }
    }).catch(erro => {
        res.redirect('/admin/articles');
    })
})

//Rota para edição de categoria. O método do roteamente tem que ser post.
router.post('/articles/update',(req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var category = req.body.category;
    if(title != undefined){

        Article.update({ //método create do sequelize para criação do registro na tabela.
            title: title,
            slug: slugify(title, {
                lower: true
            }),
            content: content,
            categoryId: category
        },{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles/');
        }).catch(err => {
            console.log(err);
        })
    }else{
        res.redirect('/admin/articles/edit/:id');
    }
});

router.get('/articles/page/:num',(req,res) => {
    var page = req.params.num;
    var offest = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 4;        
    }

    Article.findAndCountAll({
        limit:4,
        offset: offset,
        order:[
            ['id','DESC'],
        ]
    }).then(articles => {

        //código para descobrir se existe mais artigos depois da página atual
        var next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        // array que vai conter tanto a informação de next quanto de articles
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page',{result : result, categories : categories});
        })

    }).catch(err => {
        console.log('deu merda na paginação');
    });
})

//Exportar modulo para uso no index.js
module.exports = router;