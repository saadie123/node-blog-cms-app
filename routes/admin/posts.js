const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.get('/',(req,res)=>{
    res.send("working");
})

router.get('/create',(req,res)=>{
    res.render('admin/posts/create');
})

router.post('/create',(req,res)=>{
    let allowComments = req.body.allowComments === 'on' ? true : false;
    let post = new Post({
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        allowComments
    })
   // console.log(allowComments);
    post.save().then(post=>{
        console.log(post)
    })
    res.render('admin/posts/create');
})


module.exports = router;