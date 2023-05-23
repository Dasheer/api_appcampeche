const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
const {generateAccessToken} = require("../config/jwToken");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// Create User
const createUser = async (req, res) => {
    try {
        const { name, lastname, email, cellphone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({msg: "User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        let user = new User({
            name,
            lastname,
            email,
            cellphone,
            password: hashedPassword,
        });
        user = await user.save();
        res.json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validar que el usuario exista
        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(401).json({mdg: "User not found"})
        }

        const isMatch = await bcryptjs.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }

        const token = jwt.sign({ id: findUser._id }, "passwordKey");
        res.json({ token, ...findUser._doc })
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
}


const validToken = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) return res.json(false);

        const user = await User.findById(verify.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (error) {

    }
}

const authCtl = async (req, res) => {
    const user = await User.findById(res.user);
    res.json({...user._doc, token: res.token});
}
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
   try {
       const userId = req.user._id;
       const getUser = await User.findById(userId);

       if (getUser) {
           res.json(getUser);
       } else {
           res.status(404).json({ message: 'User not found' });
       }
   } catch (error) {
       res.status(500).json({ message: 'Server error' });
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

module.exports = {createUser, loginUser, validToken, authCtl, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken, logoutUser};
