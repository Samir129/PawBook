const mongoose = require('mongoose')
const config = require('config')

const dbString = config.get('mongoDBURI')

const connectDB = async () => {
    try{
        await mongoose.connect(dbString)

        console.log("MongoDB connected...")
    }
    catch(error){
        console.error(`Error connecting to Mongo : ${error.message}`);
        // Exit process in case of db connection failure
        process.exit(1)
    }
};

module.exports = connectDB