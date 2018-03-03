const express = require('express');
const fs = require('fs');
const router = express.Router();

const Post = require('../../models/Post');
const {isEmpty,uploadDir} = require('../../helpers/upload-helper');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.get('/',async (req,res)=>{
    try{
        let posts = await Post.find();
        res.render('admin/posts/index',{posts});
    } catch(error){
        console.log(error);
    }
});

router.get('/create',(req,res)=>{
    res.render('admin/posts/create');
});

router.get('/edit/:id',async (req,res)=>{
    try{
        let post = await Post.findById(req.params.id);
        console.log(post);
        res.render('admin/posts/edit',{post});        
    } catch(error){
        console.log(error);
    }
})

router.post('/create',async (req,res)=>{
    try{
        let errors = [];
        if(!req.body.title){
            errors.push({error:'Post title is required!'});
        }
        if(isEmpty(req.files)){
            errors.push({error:'Post image is required!'});
        }
        if(!req.body.status){
            errors.push({error:'Please select post status!'});
        }
        if(!req.body.description){
            errors.push({error:'Post description cannot be empty!'});
        }
        if(errors.length > 0){
            res.render('admin/posts/create',{errors,post:req.body});
        } 
        else{
            let file = req.files.postImage;
            fileName = Date.now() + '-' + file.name;
            file.mv(`./public/uploads/${fileName}`, (error)=>{
                if(error){
                    console.log(error);
                }
            });
            let allowComments = req.body.allowComments === 'on' ? true : false;
            let post = new Post({
                title: req.body.title,
                postImage: fileName,
                status: req.body.status,
                description: req.body.description,
                allowComments
            });
            let newPost = await post.save();
            req.flash('success_message',`Post ${newPost.title} was created successfully!`);
            res.redirect('/admin/posts');
        }
    } catch(error){
        console.log(error);
    }
});

router.put('/edit/:id',async (req,res)=>{
    let allowComments = req.body.allowComments === 'on' ? true : false;
    let body = {
        ...req.body,
        allowComments
    }
    try {
        let errors = [];
        if(!req.body.title){
            errors.push({error:'Post title is required!'});
        }
        if(isEmpty(req.files)){
            errors.push({error:'Post image is required!'});
        }
        if(!req.body.description){
            errors.push({error:'Post description cannot be empty!'});
        }
        if(errors.length > 0){
            body._id = req.params.id;
            res.render('admin/posts/edit',{errors,post:body});
        } 
        else{
            let file = req.files.postImage;
            fileName = Date.now() + '-' + file.name;
            file.mv(`./public/uploads/${fileName}`, (error)=>{
                if(error){
                    console.log(error);
                }
            });
            body.postImage = fileName;
            let post = await Post.findByIdAndUpdate(req.params.id,{$set:body},{new:true});
            req.flash('success_message',`Post ${post.title} was updated successfully!`);            
            res.redirect('/admin/posts');   
        }
    } catch (error) {
        console.log(error)
    }    
});

router.delete('/:id',async (req,res)=>{    
    try {
        let post = await Post.findByIdAndRemove(req.params.id);
        fs.unlink(uploadDir + post.postImage,(error)=>{
            console.log(error);
        });
        req.flash('success_message',`Post ${post.title} was deleted successfully!`);        
        res.redirect('/admin/posts');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;