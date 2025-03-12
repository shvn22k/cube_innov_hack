import mongoose, { Schema, Document } from 'mongoose';

interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    background?: {
        educationLevel?: string;
        currentStatus?: string;
        field?: string;
        experienceYears?: number;
        pastProjects?: string[];
    };
    interests?: {
        fields?: string[];
        workType?: string[];
        motivation?: string[];
    };
    skills?: {
        technical?: { level: number; title: string }[];
        soft?: string[];
    };
    challenges?: {
        skillGaps?: string[];
        workEnvironmentChallenges?: string[];
        personalLimitations?: string[];
    };
    video_chat_id?: string;
    goals?: {
        shortTerm?: string;
        longTerm?: string;
        successDefinition?: string;
        preferredRole?: string;
    };
    industryPreferences?: {
        preferredIndustries?: string[];
        relocation?: boolean;
        remoteWork?: boolean;
        companyType?: string;
        workType?: string;
    };
    learning?: {
        preferredMethod?: string[];
        furtherEducationInterest?: boolean;
        depthOrBreadth?: 'depth' | 'breadth';
    };
    financials?: {
        salaryExpectation?: number;
        workLifeBalanceImportance?: number;
        jobSecurityOverRisk?: boolean;
    };
    values?: {
        motivationType?: string[];
        workEnvironmentPreference?: string;
        teamOrSolo?: string;
        missionDriven?: boolean;
    };
    roadmap?: mongoose.Types.ObjectId;
    actionPlan?: {
        shortTermGoal?: string;
        skillsToDevelop?: string[];
        targetProjects?: string[];
        timelineMonths?: number;
    };
    questionnaire?: {
        q_id: string;
        q_res: string;
    }[];
}

const SessionSchema = new Schema<ISession>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        background: {
            educationLevel: { type: String },
            currentStatus: { type: String },
            field: { type: String },
            experienceYears: { type: Number },
            pastProjects: [{ type: String }],
        },
        interests: {
            fields: [{ type: String }],
            workType: [{ type: String }],
            motivation: [{ type: String }],
        },
        skills: {
            technical: [{ level: Number, title: String }],
            soft: [{ type: String }],
        },
        challenges: {
            skillGaps: [{ type: String }],
            workEnvironmentChallenges: [{ type: String }],
            personalLimitations: [{ type: String }],
        },
        goals: {
            shortTerm: { type: String },
            longTerm: { type: String },
            successDefinition: { type: String },
            preferredRole: { type: String },
        },
        industryPreferences: {
            preferredIndustries: [{ type: String }],
            relocation: { type: Boolean },
            remoteWork: { type: Boolean },
            companyType: { type: String },
            workType: { type: String },
        },
        learning: {
            preferredMethod: [{ type: String }],
            furtherEducationInterest: { type: Boolean },
            depthOrBreadth: { type: String, enum: ['depth', 'breadth'] },
        },
        financials: {
            salaryExpectation: { type: Number },
            workLifeBalanceImportance: { type: Number, min: 1, max: 10 },
            jobSecurityOverRisk: { type: Boolean },
        },
        values: {
            motivationType: [{ type: String }],
            workEnvironmentPreference: { type: String },
            teamOrSolo: { type: String },
            missionDriven: { type: Boolean },
        },
        actionPlan: {
            shortTermGoal: { type: String },
            skillsToDevelop: [{ type: String }],
            targetProjects: [{ type: String }],
            timelineMonths: { type: Number },
        },
        video_chat_id: { type: String },
        roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
        questionnaire: [
            {
                q_id: { type: String },
                q_res: { type: String },
            },
        ],
    },
    { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', SessionSchema);

export default Session;
