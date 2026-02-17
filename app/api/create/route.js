import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // 1. AGE CHECK (Keep the safety)
    const birthDate = new Date(data.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) age--;
    
    if (age < 18) return NextResponse.json({ success: false, error: "Must be 18+ to join Anurupa." });

    // 2. ANURUPA AI ANALYSIS
    const cleanBase64 = data.imageBase64.split(',')[1];
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Or "gemini-2.0-flash" if available
    
    const prompt = `Analyze this person for the 'Anurupa' personality engine.
    1. STRICTLY Check: Is this a REAL HUMAN? (Reject cartoons/blurry/masks).
    2. CLASSIFY the 'Aesthetic' into ONE of these categories: 
       [Minimalist, Streetwear, Vintage, Corporate, Goth, Cottagecore, Athletic, Luxury, Bohemian, Casual].
    3. IDENTIFY the 'Vibe' (1 word, e.g., Confident, Friendly, Edgy).
    4. LIST 3-5 distinct 'Fashion Items' visible (e.g., "Leather Jacket", "Silver Chain").
    
    Return JSON ONLY:
    {
        "isRealPerson": boolean,
        "aesthetic": "CategoryString",
        "vibe": "VibeString",
        "fashionTags": ["tag1", "tag2", "tag3"],
        "reason": "Short analysis of why"
    }`;

    const imagePart = { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } };
    const result = await model.generateContent([prompt, imagePart]);
    const analysis = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    if (!analysis.isRealPerson) {
        return NextResponse.json({ success: false, error: "Anurupa AI: Please upload a clear photo of a real person." });
    }

    // 3. SAVE
    const user = await User.findOneAndUpdate(
        { email: data.email }, 
        {
            name: data.name,
            bio: data.bio,
            location: data.location,
            imageUrl: data.imageBase64,
            email: data.email,
            dob: birthDate,
            age: age,
            // Save the new AI data
            aesthetic: analysis.aesthetic,
            vibe: analysis.vibe,
            fashionTags: analysis.fashionTags
        },
        { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}