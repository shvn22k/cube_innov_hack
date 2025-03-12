import mongoose, { Schema, Document } from 'mongoose';

interface IResource {
    name: string;
    type: string;
    url: string;
}

interface IProject {
    title: string;
}

interface IStage {
    stage: string;
    duration: string;
    description: string;
    skills: string[];
    resources: IResource[];
    projects: string[];
}

interface ISalary {
    entry_level: string;
    mid_level: string;
    senior_level: string;
}

export interface IRoadmap extends Document {
    career: string;
    summary: string;
    stages: IStage[];
    job_roles: string[];
    average_salary: ISalary;
    next_steps: string[];
}

const ResourceSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true }
});

const StageSchema: Schema = new Schema({
    stage: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String, required: true }],
    resources: [ResourceSchema],
    projects: [{ type: String, required: true }]
});

const SalarySchema: Schema = new Schema({
    entry_level: { type: String, required: true },
    mid_level: { type: String, required: true },
    senior_level: { type: String, required: true }
});

const RoadmapSchema: Schema = new Schema({
    career: { type: String, required: true },
    summary: { type: String, required: true },
    stages: [StageSchema],
    job_roles: [{ type: String, required: true }],
    average_salary: SalarySchema,
    next_steps: [{ type: String, required: true }]
});

const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
