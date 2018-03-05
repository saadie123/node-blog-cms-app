const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../../models/User');
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

// Single post page route
router.get('/post/:id',async (req,res)=>{
    let post = await Post.findById(req.params.id);
    let categories = await Category.find();    
    res.render('home/post',{post,categories});
});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
})

router.post('/register',async (req,res)=>{
    let errors = [];
    let oldUser = await User.findOne({email:req.body.email});
    if(oldUser){
        errors.push({error:'An account is already registered with this email!'});
    }
    if(!req.body.firstName){
        errors.push({error:'First name is required!'});
    }
    if(!validator.isEmail(req.body.email)){
        errors.push({error:'Please enter a valid email address!'});
    }
    if(!req.body.password){
        errors.push({error:'Password is required!'});
    }
    if(req.body.password.length < 6){
        errors.push({error:'Password cannot be less than 6 characters!'});
    }
    if(!req.body.passwordConfirm){
        errors.push({error:'Please confirm your password!'});
    }
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({error: 'Passwords do not match!'});
    }
    if(errors.length > 0){
        res.render('home/register',{errors,user:req.body});
    } else{
        try {
        bcrypt.hash(req.body.password,10,async (error, hash)=>{
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            });
            await user.save();
            req.flash('success_message','Account registeration successful. You can login now!');
            res.redirect('/login');
        });
        } catch (error) {
            console.log(error);
        }
    }
});

passport.use(new LocalStrategy({usernameField:'email'},async (email, password, done)=>{
    let user = await User.findOne({email});
    if(!user) return done(null,false,{message:'No user found'});
    bcrypt.compare(password,user.password,(error,matched)=>{
        if(error) return error;
        if(matched){
            return done(null,user);
        } else {
            return done(null,false,{message:'Incorrect password!'});
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
});

module.exports = router;
