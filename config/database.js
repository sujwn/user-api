const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`Connected to MongoDB database with host: ${con.connection.host}`);
    });
};

module.exports = dbconnect;