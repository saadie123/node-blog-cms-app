// Module imports
const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
mongoose.connect('mongodb://localhost/blog-cms');
mongoose.Promise = global.Promise;

const {select} = require('./helpers/hbs-helpers');

// Router imports
const homeRouter = require('./routes/home/main');
const adminRouter = require('./routes/admin/main');
const postsRouter = require('./routes/admin/posts');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));


// View Engine Setup
app.engine('handlebars',expresshbs({defaultLayout:'home',helpers: {select:select}}));
app.set('view engine','handlebars');

// Route Middlewares
app.use('/',homeRouter);
app.use('/admin',adminRouter);
app.use('/admin/posts',postsRouter);


// Server port setup
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App started on port ${port}`);
});