import mongoose from "mongoose"
const connect = async()=>{
    const connectionState = mongoose.connection.readyState;
    if(connectionState===1){
        console.log("Already connected");
        return;
    }
    if(connectionState===2){
        console.log("Connecting...")
        return;
    }
    try{
        console.log("Connecting")
        mongoose.connect(process.env.DB_URI!!)
        console.log("Connected to DB");

    }
    catch(err:any){
        console.error(err);
        throw new Error(err)
    }
}

export default connect;