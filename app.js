// Module imports
const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb://localhost/blog-cms');
mongoose.Promise = global.Promise;

// Router imports
const homeRouter = require('./routes/home/main');
const adminRouter = require('./routes/admin/main');
const postsRouter = require('./routes/admin/posts');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

// View Engine Setup
app.engine('handlebars',expresshbs({defaultLayout:'home'}));
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