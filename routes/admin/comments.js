const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});


router.get('/',async (req,res)=>{
    let comments = await Comment.find({user: req.user.id}).populate('user');
    res.render('admin/comments/index',{comments});
});


router.post('/:postId',async (req, res, next) => {
   try {
        let post = await Post.findById(req.params.postId);
        if(post){
            let comment = new Comment({
                user: req.user.id,
                text: req.body.text
            });
            post.comments.push(comment);
            let updatedPost = await post.save();
            let newComment = await comment.save();
            console.log(updatedPost);
            res.redirect(`/post/${updatedPost.id}`);
        }
   } catch (error) {
       console.log(error);
   }
});

router.delete('/:id',async (req,res)=>{
    try {
        let comment = await Comment.findByIdAndRemove(req.params.id);
        if(comment){
           let post = await Post.findOneAndUpdate({comments:req.params.id},{$pull:{comments:req.params.id}});
            res.redirect('/admin/comments');
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;