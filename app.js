// Module imports
const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');

const app = express();

// Router imports
const homeRouter = require('./routes/home/main');
const adminRouter = require('./routes/admin/main');

app.use(express.static(path.join(__dirname,'public')));

// View Engine Setup
app.engine('handlebars',expresshbs({defaultLayout:'home'}));
app.set('view engine','handlebars');

// Route Middlewares
app.use('/',homeRouter);
app.use('/admin',adminRouter);


// Server port setup
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App started on port ${port}`);
});