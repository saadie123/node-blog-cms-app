const express = require('express');

const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');


const router = express.Router();
router.all('/*',(req,res,next)=>{
    if(req.isAuthenticated()){
        req.app.locals.layout = "admin";
        next();
    } else {
        res.render('home/login',{error:'Please login first!'});
    }
});

// Admin dashboard route
router.get('/',async (req,res)=>{
    try {
        let postCount = await Post.count({user:req.user.id});
        let commentCount = await Comment.count({user:req.user.id});
        let categoryCount = await Category.count();
        res.render('admin/index',{postCount,commentCount,categoryCount});
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;