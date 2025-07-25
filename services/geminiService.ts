
import { GoogleGenAI, Type } from "@google/genai";
import type { SupabaseLead, AILead } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            full_name: {
                type: Type.STRING,
                description: 'The full name of the person (from author_name).',
            },
            interests: {
                type: Type.STRING,
                description: 'Extract the top 3 interests from the author_description as a comma-separated string.',
            },
            success_rate: {
                type: Type.INTEGER,
                description: 'Estimate a success probability (from 0 to 100) representing how strongly this lead matches the target customer profile.',
            },
            phone: {
                type: Type.STRING,
                description: 'Find any phone number in the provided texts. If not found, the value should be null.',
                nullable: true,
            },
            email: {
                type: Type.STRING,
                description: 'Find any email address. If not found, the value should be null.',
                nullable: true,
            },
            profile_url: {
                type: Type.STRING,
                description: 'The URL to the person\'s profile (from author_url).',
            },
            post_text: {
                type: Type.STRING,
                description: 'The full text of the post, combining post_title and author_description.',
            },
            post_summary: {
                type: Type.STRING,
                description: 'Summarize the post_text in a single sentence.',
            },
            message_content: {
                type: Type.STRING,
                description: 'Crucially, write a short, personalized outreach message (about 50-70 words). It must start with "مرحباً [full_name]", reference their post (post_summary), connect it to the service offered (from the company profile), and end with a call-to-action question.',
            },
        },
        required: ["full_name", "interests", "success_rate", "profile_url", "post_text", "post_summary", "message_content"],
    },
};

export const analyzeLeadsWithAI = async (
    myBusiness: string,
    targetCustomer: string,
    leads: SupabaseLead[]
): Promise<AILead[]> => {
    if (leads.length === 0) {
        return [];
    }

    const prompt = `
        You are an expert in sales and marketing copywriting. Your task is to analyze a list of potential leads and prepare comprehensive data for outreach based on a company profile.

        **Company Profile:**
        - **Business Field:** ${myBusiness}
        - **Target Customer:** ${targetCustomer}

        **Raw Data for Analysis (from 'lead' table):**
        ${JSON.stringify(leads, null, 2)}

        **Instructions:**
        For each item in the raw data, do the following:
        1.  **Decide** if the person matches the "Target Customer" profile. If they do not match, ignore them completely.
        2.  **For matching leads only**, generate a JSON object with the fields defined in the provided schema.
        3.  **Your final output must be only a valid JSON array**, without any additional text, explanations, or markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const aiLeads: AILead[] = JSON.parse(jsonString);
        return aiLeads;
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to get a valid response from the AI. Details: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI analysis.");
    }
};
