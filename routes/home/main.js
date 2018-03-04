const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Category = require('../../models/Category');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "home";
    next();
});

// Home page route
router.get('/',async (req,res)=>{
    let posts = await Post.find();
    let categories = await Category.find();
    res.render('home/index',{posts,categories});
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
    let categories = await Category.find();    
    res.render('home/post',{post,categories});
});

module.exports = router;
