const express = require('express');
const router = express.Router(); // para diferenciar controllers do principal usa a constante router
const Category = require('./Category'); //referencia do modelo Category para manipulação da tabela com o sequelize
const slugify = require('slugify'); // biblioteca que transaforma titulos em slug


//rota para a página de formulário de criação de categoria
router.get('/admin/categories/new',(req,res) => {
    res.render('admin/categories/new');
});


//Rota para criação de categoria. O método do roteamente tem que ser post.
router.post('/categories/save',(req,res) => {
    var title = req.body.title;
    if(title != undefined){

        Category.create({ //método create do sequelize para criação do registro na tabela.
            title: title,
            slug: slugify(title, {
                lower: true
            })
        }).then(() => {
            res.redirect('/admin/categories');
        })
    }else{
        res.redirect('/admin/categories/new');
    }
});

//Rota para exclusão de categoria. O método do roteamente tem que ser post.
router.post('/categories/delete',(req,res) => {
    var id = req.body.id; // captura o input com name id do formulario
    if (id != undefined) {
        if (!isNaN(id)) {

            Category.destroy({ //método do sequelize para excluir uma linha
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            })
            
        } else {
            res.redirect('/admin/categories');
        }
        
    } else {
            res.redirect('/admin/categories');
    }
})

router.get('/admin/categories',(req,res) => {

    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories});
    })
    
});

router.get('/admin/categories/edit/:id', (req,res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id).then(category =>{
        if (category != undefined) {

            res.render('admin/categories/edit',{category: category})
            
        } else {
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    })
})

//Rota para criação de categoria. O método do roteamente tem que ser post.
router.post('/categories/update',(req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    if(title != undefined){

        Category.update({ //método create do sequelize para criação do registro na tabela.
            title: title,
            slug: slugify(title, {
                lower: true
            })
        },{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        })
    }else{
        res.redirect('/admin/categories/edit/:id');
    }
});


//Exportar modulo para uso no index.js
module.exports = router;