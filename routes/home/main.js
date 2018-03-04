const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "home";
    next();
});

// Home page route
router.get('/',async (req,res)=>{
    let posts = await Post.find();
    res.render('home/index',{posts});
});

// About page route
router.get('/about',(req,res)=>{
    res.render('home/about');
});

// Register page route
router.get('/register',(req,res)=>{
    res.render('home/register');
});

// Login page route
router.get('/login',(req,res)=>{
    res.render('home/login');
});

router.get('/post/:id',async (req,res)=>{
    let post = await Post.findById(req.params.id);
    res.render('home/post',{post});
});

module.exports = router;
