import mongoose from "mongoose";

export const dbConnection =()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName : "Restaurant_Table_Booking",
    }).then(()=>{
        console.log("connected to databases");
    }).catch((err)=>{
        console.log(`some error occured while connecting to databases: ${err}`);
    });
};

