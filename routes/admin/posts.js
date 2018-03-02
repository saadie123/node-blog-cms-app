const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.get('/',(req,res)=>{
    Post.find().then(posts=>{
        res.render('admin/posts/index',{posts});
    }).catch(error=>{
        console.log(error);
    })
});

router.get('/create',(req,res)=>{
    res.render('admin/posts/create');
});

router.get('/edit/:id',(req,res)=>{
    Post.findById(req.params.id).then(post=>{
        res.render('admin/posts/edit',{post});
    })
})

router.post('/create',(req,res)=>{
    let allowComments = req.body.allowComments === 'on' ? true : false;
    let post = new Post({
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        allowComments
    });
    post.save()
    .then(post=>{
        console.log(post);
    })
    .catch(error=>{
        console.log(error);
    });
    res.redirect('/admin/posts');
});

router.put('/edit/:id',(req,res)=>{
    let allowComments = req.body.allowComments === 'on' ? true : false;
    let body = {
        ...req.body,
        allowComments
    }
    Post.findByIdAndUpdate(req.params.id,{$set:body})
    .then(post=>{
        res.redirect('/admin/posts');
    })
    .catch(error=>{
       console.log(error);
    });
});

router.delete('/:id',(req,res)=>{
    Post.findByIdAndRemove(req.params.id)
    .then(post=>{
        res.redirect('/admin/posts');
    })
    .catch(error=>{
        console.log(error);
    });
});

module.exports = router;