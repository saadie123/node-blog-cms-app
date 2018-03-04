const express = require('express');
const Category = require('../../models/Category');

const router = express.Router();
router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.get('/',async (req,res)=>{
    try {
        let categories = await Category.find();
        res.render('admin/categories/index',{categories});
    } catch (error) {
        console.log(error);
    }
});

router.post('/create',async (req,res)=>{
    try {
        let errors = [];
        let checkCategory = await Category.findOne({name: req.body.name});
        if(checkCategory){
            errors.push({error:'Category already exists!'});            
        }
        if(!req.body.name){
            errors.push({error:'Category name is required!'});
        }
        if(errors.length > 0){
           return res.render('admin/categories/index',{errors});            
        }
        let category = new Category({
            name: req.body.name
        });
        let newCategory = await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;