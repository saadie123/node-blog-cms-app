const express = require('express');

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
router.get('/',(req,res)=>{
    res.render('admin/index');
});



module.exports = router;