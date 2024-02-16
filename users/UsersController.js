const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/users', (req,res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users: users});
    });
});

router.get('/admin', adminAuth, (req,res) => {
    res.render('admin/index');
});


router.get('/admin/users/create', (req,res) => {
    res.render('admin/users/create');
});

router.post('/users/create', (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => { //checa se e-mail já existe no banco
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(()=> {
                res.redirect("/");
            }).catch(err => {
                res.redirect('/');
            }); 
        }else{
            res.redirect('/admin/users/create');
        }
    });
});

router.get('/login',(req,res) =>{
    res.render('admin/users/login');
});

router.post('/auth', (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){ //checar se o usuário existe;
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){ //se a senha for correta ...
                req.session.user = { //... cria a sessão
                    id: user.id,
                    email: user.email
                }
            res.redirect('/admin');
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    })
});

router.get('/logout', (req,res)=>{
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router;