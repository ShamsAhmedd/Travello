const mongoose = require("mongoose");
async function connectToDb() {
    try {
        await mongoose
            .connect(process.env.MONGO_URI)//عشان الاكسبريس يعرف يقرا الفولدر لازم انزله باكدج dotenv
        console.log("connected to mongoDb")
    } catch (error) {
        console.log("connected to mongoDb")
    }
}
module.exports = connectToDb;