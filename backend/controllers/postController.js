const Post = require('../models/postModel')
const User = require('../models/userModel')

//create
exports.createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if(!req.file){
            return res.status(404).jons({success:false, message:"Please Upload an image"})
        }

        const postImage= req.file.path.replace(/\\/g, "/");
        const imageUrl = `${req.protocol}://${req.get('host')}/${postImage}`;

        const author = req.user._id;
        const post = await Post.create({ title, content,author,image:imageUrl})
        
        const populatedPost = await Post.findById(post._id).populate('author')

        res.status(201).json({
            success:true,
            populatedPost
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//get all posts
exports.getAllPosts = async(req,res,next)=>{
    try {
        const posts = await Post.find().populate('author')
        res.status(200).json({
            success:true,
            posts
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

// get post by id
exports.getPost = async(req,res,next)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(400).json({success:false, message:'Post Not Found'})
        }

        res.status(200).json({
            success:true,
            post
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//update 
exports.updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body; 
        const { id } = req.params; 

        if (!title && !content) {
            return res.status(400).json({ success: false, message: "Please enter at least one field to update the post." });
        }

        const updateDetails = {};
        if (title) updateDetails.title = title; 
        if (content) updateDetails.content = content;
        updateDetails.updatedAt = Date.now(); 

        const updatedPost = await Post.findByIdAndUpdate(id, updateDetails, { new: true, runValidators: true });

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        if (updatedPost.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You don't have access to change this post." });
        }

        res.status(200).json({
            success: true,
            updatedPost
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//delete 
exports.deletePost = async(req,res,next)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(400).json({success:false, message:'Post Not Found'})
        }

        if(post.author.toString() !== req.user._id.toString()){
            return res.status(400).json({success:false, message: 'You dont have access to change this post.'})
        }
        await post.deleteOne()

        res.status(200).json({
            success:true,
            message: "Post Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// likePost
exports.likePost = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { userId } = req.body; 

        const post = await Post.findById(id); 
        if (!post) {
            return res.status(404).json({ success: false, message: "Post Not Found" });
        }

        if (post.likes.includes(userId)) {
            console.log(post.likes)
            post.likes = post.likes.filter(like => like.toString() !== userId.toString());
           
        } else {
            post.likes.push(userId);
       
        }
        await post.save();

        res.status(200).json({
            success: true,
            post,
            

        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




//comment 
exports.commentPost = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const {text} = req.body;

        if(!text){
            return res.status(400).json({success:false, message:"Please Enter the Text"})
        }

        const post = await Post.findById(id)
        if(!post){
            return res.status({success:false, message:"Post Not Found"})
        }

        post.comments.push({
            user: req.user._id,
            text,
        })

        await post.save()

        res.status(200).json({
            success:true,
            message:'comment Added',
            post
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

