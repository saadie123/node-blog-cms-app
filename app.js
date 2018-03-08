// Module imports
const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressFileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const {mongoDbUrl} = require('./config/database');

const app = express();
mongoose.connect(mongoDbUrl);
mongoose.Promise = global.Promise;

// hbs Helper functions import
const {select,dateFormat,paginate} = require('./helpers/hbs-helpers');

// Router imports
const homeRouter = require('./routes/home/main');
const adminRouter = require('./routes/admin/main');
const postsRouter = require('./routes/admin/posts');
const categoriesRouter = require('./routes/admin/categories');
const commentsRouter = require('./routes/admin/comments');

app.use(express.static(path.join(__dirname,'public')));
app.use(expressFileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: 'javascriptislove',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Locals Middleware
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.successMessage = req.flash('success_message');
    res.locals.error = req.flash('error');
    next();
});

// View Engine Setup
app.engine('handlebars',expresshbs({defaultLayout:'home',helpers: {select,dateFormat,paginate}}));
app.set('view engine','handlebars');

// Route Middlewares
app.use('/',homeRouter);
app.use('/admin',adminRouter);
app.use('/admin/posts',postsRouter);
app.use('/admin/categories',categoriesRouter);
app.use('/admin/comments',commentsRouter);

// Server port setup
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App started on port ${port}`);
});