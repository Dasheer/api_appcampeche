const express = require('express');
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken, logoutUser, validToken, authCtl
} = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, authCtl)

router.post('/register', createUser);

router.post('/login', loginUser);

router.post('/isValidToken', validToken);


/*router.get('/currentUser', authenticateToken, getUser);

router.get('/users', getAllUsers);

router.get('/:id/post', getPosts)

router.get('/refresh', handleRefreshToken);

router.get('/logout', logoutUser);

router.put('/:id', updateUser);*/

//router.put('/:id/post/:id', updatePost);


router.delete('/:id', deleteUser);

//router.delete('/:id/post/:id', deletePost);

module.exports = router;
