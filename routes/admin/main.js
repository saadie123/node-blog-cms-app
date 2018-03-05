const express = require('express');
const {isAuthenticated} = require('../../helpers/auth.js');

const router = express.Router();
router.all('/*',isAuthenticated,(req,res,next)=>{
        req.app.locals.layout = "admin";
});

// Admin dashboard route
router.get('/',(req,res)=>{
    res.render('admin/index');
});



module.exports = router;