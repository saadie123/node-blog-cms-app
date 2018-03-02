const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

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
        res.render('admin/posts/edit',{post});        
    } catch(error){
        console.log(error);
    }
})

router.post('/create',async (req,res)=>{
    try{
        let allowComments = req.body.allowComments === 'on' ? true : false;
        let post = new Post({
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            allowComments
        });
        let newPost = await post.save();
        res.redirect('/admin/posts');
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
        let post = await Post.findByIdAndUpdate(req.params.id,{$set:body},{new:true});
        res.redirect('/admin/posts');   
    } catch (error) {
        console.log(error)
    }    
});

router.delete('/:id',async (req,res)=>{    
    try {
        let post = await Post.findByIdAndRemove(req.params.id);
        res.redirect('/admin/posts');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;