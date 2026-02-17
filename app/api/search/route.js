import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { query } = await req.json();

    if (!query) {
        const users = await User.find().sort({ createdAt: -1 }).limit(20);
        return NextResponse.json({ success: true, users });
    }

    // AI Translation: Natural Language -> MongoDB Query
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Translate this user search: "${query}" into a MongoDB find query JSON.
    Fields available: 'name', 'location', 'aesthetic', 'vibe', 'fashionTags'.
    Example: "Find minimalist in Chicago" -> { "location": { "$regex": "Chicago", "$options": "i" }, "aesthetic": "Minimalist" }
    
    Return JSON ONLY. Do not wrap in markdown.`;

    const result = await model.generateContent(prompt);
    let mongoQuery = {};
    
    try {
        mongoQuery = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
    } catch (e) {
        // Fallback if AI fails: simple text search
        mongoQuery = { 
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { aesthetic: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        };
    }

    const users = await User.find(mongoQuery).limit(20);
    return NextResponse.json({ success: true, users });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}