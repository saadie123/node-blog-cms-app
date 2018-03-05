const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

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


module.exports = router;