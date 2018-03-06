const express = require('express');
const fs = require('fs');
const router = express.Router();

const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {isEmpty,uploadDir} = require('../../helpers/upload-helper');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.get('/',async (req,res)=>{
    try{
        let posts = await Post.find({user: req.user.id}).populate('category');
        res.render('admin/posts/index',{posts});
    } catch(error){
        console.log(error);
    }
});

router.get('/create',async (req,res)=>{
    try {
        let categories = await Category.find();
        res.render('admin/posts/create',{categories});
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id',async (req,res)=>{
    try{
        let post = await Post.findById(req.params.id);
        let categories = await Category.find();        
        res.render('admin/posts/edit',{post,categories});        
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
        if(!req.body.category){
            errors.push({error:'Please select post category!'});
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
                allowComments,
                category: req.body.category,
                user: req.user.id
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
        if(!req.body.description){
            errors.push({error:'Post description cannot be empty!'});
        }
        if(errors.length > 0){
            body._id = req.params.id;
            res.render('admin/posts/edit',{errors,post:body});
        } 
        else{
            if(!isEmpty(req.files)){
                let post = await Post.findById(req.params.id);
                fs.unlink(uploadDir + post.postImage,(error)=>{
                    console.log(error);
                });
                let file = req.files.postImage;
                fileName = Date.now() + '-' + file.name;
                file.mv(`./public/uploads/${fileName}`, (error)=>{
                    if(error){
                        console.log(error);
                    }
                });
                body.postImage = fileName;
            }
            let updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:body},{new:true});
            req.flash('success_message',`Post ${updatedPost.title} was updated successfully!`);            
            res.redirect('/admin/posts');   
        }
    } catch (error) {
        console.log(error)
    }    
});

router.delete('/:id',async (req,res)=>{    
    try {
        let post = await Post.findByIdAndRemove(req.params.id).populate('comments');
        post.comments.forEach(async comment => {
            await Comment.findByIdAndRemove(comment._id);
        });
        fs.unlink(uploadDir + post.postImage,(error)=>{
            console.log(error);
        });
        req.flash('success_message',`Post ${post.title} and its comments were deleted successfully!`);        
        res.redirect('/admin/posts');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;