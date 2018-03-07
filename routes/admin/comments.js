const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = "admin";
    next();
});


router.get('/',async (req,res)=>{
    try {
        let comments = await Comment.find({user: req.user.id}).populate('user');
        res.render('admin/comments/index',{comments});
    } catch (error) {
        console.log(error)
    }
});

router.post('/approve-comment',async (req,res)=>{
    try {
        const id = req.body.id;
        let comment = await Comment.findByIdAndUpdate(req.body.id,{$set:{approveComment:req.body.approveComment}});
        res.send({comment});
    } catch (error) {
        console.log(error);
    }
})


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
            req.flash('success_message',`Your comment will be reviewed`);            
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
});



module.exports = router;