import {NextFunction,Request,Response} from "express";
import Session from "@models/session.model";
import {APIError} from "@utils/Error";
import Roadmap from "@models/roadmap.model";
import generatePDF from "@utils/pdf";
import path from "path"
import {parse, v4 as uuidv4} from 'uuid';
import {parseInput, roadmapGenerate} from "@utils/agent.service";
export const initateSession = async(req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const auth = req.auth;
   if(!auth){
       return next(new APIError("Please login first",401))
   }
    const userId = auth!.userId;
   try{
       const session = new Session({
           userId:userId,
            questionnaire:[]
       });
       await session.save();
       res.status(200).json({success:true,_id:session._id});
   }
   catch(err){
       console.log(err)
       return next(new APIError("Internal Server error",500));
   }

}

export const fillDetails = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        //@ts-ignore
        const auth = req.auth;
        const userId = auth!.userId;
        const sessionId = req.query.sessionId;
        console.log(sessionId);
        const {q_id,q_res} = req.body;
        const session = await Session.findById(sessionId);
        console.log(session);
        if(!session){
            return next(new APIError("Invalid session id",401));
        }
        const question = {q_id:q_id,q_res:q_res};
        // session.question.push(question);
    if(session.questionnaire&&session.questionnaire.length>0&&session.questionnaire.some(question=>question.q_id==q_id)){
        session.questionnaire.filter(question=>question.q_id == q_id);

        }
        session.questionnaire?.push(question);
    await session.save();
    res.status(200).json({success:true});
    }
    catch (error){
        console.log(error);
        return next(new APIError("Internal Server error",500));
    }
}
export const finalize = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        //@ts-ignore
        const auth = req.auth;
        const sessionId = req.query.sessionId;
        const session = await Session.findById(sessionId);
        if(!session){
            return next(new APIError("Invalid session id",401));
        }
        // backend request to api for ai res
        const parsedData = parseInput(session.questionnaire!!.map(item => `ID: ${item.q_id}, Title: ${careerQuestions.get(item.q_id)}, Response: ${item.q_res}`).join('\n'))
       // create a roadmap
        const roadmap = roadmapGenerate(parsedData)
        console.log(roadmap)
        console.log(parsedData);
       // initial video res which will be saved to our server
        await session.save();
        res.status(200).json({success:true,roadmap:roadmap});
    }
    catch(err){
        return next(new APIError("Internal Server error",500));
    }
}
export const downloadRoadmap = async(req:Request,res:Response,next:NextFunction)=>{
    //@ts-ignore
    const auth = req.auth;
    const sessionId = req.query.sessionId;
    const session = await Session.findById(sessionId);
    if(!session){
        return next(new APIError("Invalid session id",401));

    }
    const roadmap = await Roadmap.findById(session.roadmap);
    if(!roadmap){
        return next(new APIError("Invalid roadmap",401));
    }
    const outputPath = path.join(process.cwd(),'src','public',uuidv4())
   const pdf =  await generatePDF(roadmap, outputPath);
    res.status(200).sendFile(outputPath,(err)=>{
        if(err){
            console.log(err);
            return next(new APIError("Internal Server error",500));
        }

    })
}
