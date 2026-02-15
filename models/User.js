import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  location: String,
  imageUrl: String,
  dob: Date,
  age: Number,
  
  // NEW: The "Anurupa" Personality Engine
  aesthetic: { type: String }, // e.g., "Minimalist", "Streetwear", "Cottagecore"
  vibe: { type: String },      // e.g., "Cheerful", "Mysterious", "Professional"
  fashionTags: [String],       // e.g., ["Oversized Hoodie", "Vintage Watch", "Sneakers"]
  
  // Keep technical fields
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);