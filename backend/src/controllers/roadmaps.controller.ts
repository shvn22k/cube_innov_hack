import {NextFunction,Request,Response} from "express";
import {APIError} from "@utils/Error";
import Roadmap from "@models/roadmap.model";
import User from "@models/user.model";
import SavedRoadmap from "@models/saved_roadmap.model";

export const saveRoadmap = async(req:Request,res:Response,next:NextFunction) => {
    const roadmap_id = req.query.roadmap_id;
    try{
        // const roadmap =
        //@ts-ignore
        const auth = req.auth;
        if(!auth){
            return next(new APIError("Please login first",401));
        }
       const roadmap = await Roadmap.findById(roadmap_id);
if(!roadmap){
    return next(new APIError("Invalid roadmap",401));
}
    const savedRoadmap = await SavedRoadmap.create({
        roadmapId:roadmap_id,
        userId:auth.userId
    });
res.status(200).json({
    success:true
});

    }
        catch(err){
        console.log(err);
        return next(new APIError("Some error occured",500))
    }
}

