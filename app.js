const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');

const app = express();


app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars',expresshbs({defaultLayout:'home'}));
app.set('view engine','handlebars');

app.get('/',(req,res)=>{
    res.render('home/index');
});

app.get('/about',(req,res)=>{
    res.render('home/about');
});

app.get('/register',(req,res)=>{
    res.render('home/register');
})

app.get('/login',(req,res)=>{
    res.render('home/login');
})

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`App started on port ${port}`);
});