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

router.get('/edit/:id',async (req,res)=>{
    try {
        let category = await Category.findById(req.params.id);
        res.render('admin/categories/edit',{category});
    } catch (error) {
        console.log(error);
    }
})

router.post('/create',async (req,res)=>{
    try {
        let errors = [];
        let checkCategory = await Category.findOne({name: req.body.name});
        let allCategories = await Category.find();
        if(checkCategory){
            errors.push({error:'Category already exists!'});            
        }
        if(!req.body.name){
            errors.push({error:'Category name is required!'});
        }
        if(errors.length > 0){
           return res.render('admin/categories/index',{errors,categories:allCategories});            
        }
        let category = new Category({
            name: req.body.name
        });
        let newCategory = await category.save();
        req.flash('success_message',`Category ${newCategory.name} was created successfully!`);                
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
});

router.put('/edit/:id',async (req,res)=>{
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
                return res.render('admin/categories/edit',{errors,category:checkCategory});            
            } else{
                let body = req.body;
                let updatedCategory = await Category.findByIdAndUpdate(req.params.id,{$set:body},{new:true});
                req.flash('success_message',`Category ${updatedCategory.name} was updated successfully!`);                
                res.redirect('/admin/categories');
            }
        } catch (error) {
            console.log(error);
        }
});

router.delete('/:id',async (req,res)=>{
    try {
        let category = await Category.findByIdAndRemove(req.params.id);
        req.flash('success_message',`Category ${category.name} was deleted successfully!`);        
        res.redirect('/admin/categories');        
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;