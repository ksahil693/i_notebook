const mongoose= require('mongoose');
const mongoURI ="mongodb+srv://shlkumar435:7876025693@cluster0.w7ho6gy.mongodb.net/iNoteBook"


const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo Succesfully")
    })
}


module.exports= connectToMongo;
