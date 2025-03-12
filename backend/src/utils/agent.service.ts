import axios from "axios";
import z from "zod";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BASE_URL = "https://api.groq.com/v1/chat/completions";
const parseInputSchema = z.object({
    userInput: z.string(),
});
export const runGroq = async (prompt: string, modelId: string) => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: modelId,
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.message);
    }
};
export const cleanJson = (content: string) => {
    if (content.startsWith("```") && content.endsWith("```")) {
        content = content.replace(/^```json|```$/g, "").trim();
    }
    return JSON.parse(content);
};
export const parseInput = async (userInputS:string) => {
    try {
        const {userInput} = parseInputSchema.parse(userInputS);
        const prompt = `User input: ${userInput}\nExtract structured career-related data from the above input.`;

        const result = await runGroq(prompt, "llama-3.3-70b-versatile");
        return cleanJson(result);
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}


const roadmapSchema = z.object({
    userData: z.record(z.any()),
});
export const roadmapGenerate = async (userInput:any) => {
    try {
        const { userData } = roadmapSchema.parse(userInput);
        const prompt = `User data: ${JSON.stringify(userData)}\nGenerate a detailed and personalized roadmap for the above user.`;

        const result = await runGroq(prompt, "llama-3.3-70b-versatile");
        return cleanJson(result);
    } catch (error: any) {
        console.error(error);
       throw new Error(error);
    }
    }