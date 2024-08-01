import mongoose,{ mongo } from "mongoose";

const ConnectToMongoDB= async () => {
    console.log(process.env.MONGO_DB_URI)
    try {
        await mongoose.connect(process.env.MONGO_DB_URI,{
            dbName:'TakeMeHome',
           

        });
        console.log('connected to mongo DB')
    }
    catch(error){
        console.log('Error while connecting to Mongo DB :',error);
    }
}

export default ConnectToMongoDB