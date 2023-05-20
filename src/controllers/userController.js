const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
const {generateAccessToken} = require("../config/jwToken");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const {decode} = require("jsonwebtoken");

// Create User
const createUser = asyncHandler (async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'User created successfully',
            data: {
                user: newUser,
            },
        });
    } else {
        res.json({
            msg: 'User already exists',
            success: false,
        })
    }
});

// Login User
const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;

    // Validar que el usuario exista
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {

        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            { refreshToken },
            { new: true }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            //path: '/api/v1/refreshToken',
        });

        res.json({
            _id: findUser?._id,
            name: findUser?.name,
            lastname: findUser?.lastname,
            email: findUser?.email,
            cellphone: findUser?.cellphone,
            token: generateAccessToken(findUser?._id),
        });
    } else {
        throw new Error('Invalid email or password');
    }
});

// Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if(!cookie?.refreshToken) throw new Error('No refresh token');

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error('Invalid refresh token');
    //res.json(user);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateAccessToken(user?._id);
        res.json({ accessToken });
    });

});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh token');
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });

    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }

    await User.findOneAndUpdate(refreshToken, {
        refreshToken: '',
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            name: req?.body?.name,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            cellphone: req?.body?.cellphone,
        }, { new: true });
        res.json(updateUser);
    } catch (error) {
        throw new Error('User not found');
    }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User
const getUser = asyncHandler(async (req, res) => {
   const { id } = req.params;

   try {
       const getUser = await User.findById(id);
       res.json(getUser);
   } catch (error) {
       throw new Error('User not found');
   }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
   const { id } = req.params;
   try {
       const deleteUser = await User.findByIdAndDelete(id);
       res.json(deleteUser);
   } catch (error) {
       throw new Error('User not found');
   }
});

module.exports = {createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken, logoutUser};
