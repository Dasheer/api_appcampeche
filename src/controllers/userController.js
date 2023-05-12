const User = require('../models/userModel');

const createUser = async (req, res) => {
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
        res.status(400).json({
            status: 'User already exists',
            success: false,
        });
    }
}

module.exports = {createUser};
