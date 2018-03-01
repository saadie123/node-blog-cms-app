const express = require('express');
const router = express.Router();

// Home page route
router.get('/',(req,res)=>{
    res.render('home/index');
});

// About page route
router.get('/about',(req,res)=>{
    res.render('home/about');
});

// Register page route
router.get('/register',(req,res)=>{
    res.render('home/register');
})

// Login page route
router.get('/login',(req,res)=>{
    res.render('home/login');
})

module.exports = router;
