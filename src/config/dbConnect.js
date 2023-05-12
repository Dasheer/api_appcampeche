const mongoose = require('mongoose');

const dbConnect = () => {
    try {
        mongoose.Promise = global.Promise;

        const mongoUrl = process.env.MONGO_URI;
        if (!mongoUrl) {
            throw new Error('Mongo url is not defined');
        }

        mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Database connected successfully');
        }).catch((error) => {
            console.error('Error connecting to database: ', error);
        })
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbConnect;
