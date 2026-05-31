const { Router } = require('express');
const authMiddleware = require('./middlewares/authMiddleware');

const { register, login, me, updateProfile } = require('./controllers/AuthController');
const { listPosts, getPost, createPost, updatePost, deletePost } = require('./controllers/PostController');

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, me);
router.put('/auth/profile', authMiddleware, updateProfile);

router.get('/posts', listPosts);
router.get('/posts/:id', getPost);
router.post('/posts', authMiddleware, createPost);
router.put('/posts/:id', authMiddleware, updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);

module.exports = router;