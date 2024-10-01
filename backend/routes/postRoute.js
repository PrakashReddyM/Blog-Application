const express = require('express');
const { createPost, getAllPosts, updatePost, deletePost, getPost, likePost, commentPost } = require('../controllers/postController');
const {isAuthenticated  } = require('../middlewares/auth');
const upload = require('../middlewares/multer')
const router = express.Router()




router.route('/post/new').post(isAuthenticated,upload.single('image'),createPost)
router.route('/posts').get(isAuthenticated,getAllPosts)
router.route('/post/:id').post(updatePost).delete(isAuthenticated,deletePost).get(getPost)
router.route('/post-like/:id').post(likePost)     
router.route('/posts/:id/comments').post(isAuthenticated,commentPost)  

module.exports = router;