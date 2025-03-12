import mongoose from "mongoose";

const savedRoadmapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roadmapId:{type:mongoose.Schema.Types.ObjectId, required: true,ref:"Roadmap"},
},{
    timestamps: true,
})

const SavedRoadmap = mongoose.model("SavedRoadmap", savedRoadmapSchema);
export default SavedRoadmap;