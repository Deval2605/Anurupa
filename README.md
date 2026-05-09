# ♾️ Anurupa (अनुरूप)
> **The AI-Powered Personality & Aesthetic Engine.**
> Because manually typing out your "vibe" is exhausting. Let the AI do the judging.

[![Next.js](https://img.shields.io/badge/Next.js-Black?logo=next.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?logo=google&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](#)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](#)

### 🚀 Live Demo: [anurupa.vercel.app](https://anurupa.vercel.app/)  

**Anurupa App Screenshot**

<img width="1851" height="919" alt="image" src="https://github.com/user-attachments/assets/883660ea-452f-4744-a101-5a6f740b9cde" />



## 💡 What is it?
Anurupa (Sanskrit for "suitable" or "corresponding") is a full-stack social matching platform. Instead of basic drop-down filters, users upload a photo, and our **Google Gemini 2.5 Flash Multimodal AI** scans their outfit, lighting, and posture to automatically classify their *Aesthetic* (e.g., Streetwear, Minimalist), extract their *Vibe*, and tag their fashion items. 

Want to find a "Minimalist in New York"? Just type it in the smart search. The AI translates human language into complex database queries on the fly. 

---

## 🏗️ Data Flow & Architecture

```mermaid
graph TD
    Client[User Mobile/Web] -->|Edge Delivery| CDN[Vercel Edge Network]
    
    subgraph Serverless Architecture
    CDN --> UI[Next.js React Server Components]
    CDN --> API[Next.js API Routes]
    end

    API -->|1. Authenticate| Auth[Google OAuth 2.0]
    API -->|2. Multi-modal Prompt| AI[Google Gemini 2.5 Flash]
    API -->|3. Read/Write| DB[(MongoDB Atlas)]

    classDef edge fill:#111,stroke:#fff,stroke-width:1px,color:#fff;
    classDef serverless fill:#333,stroke:#fff,stroke-width:1px,color:#fff;
    classDef db fill:#001e2b,stroke:#00ed64,stroke-width:2px,color:#00ed64;
    classDef ai fill:#fce8e6,stroke:#ea4335,stroke-width:2px,color:#ea4335;

    class CDN edge;
    class UI,API serverless;
    class DB db;
    class AI ai;
```
 # System Architecture

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Next.js (App Router)
    participant Gemini as Google Gemini AI
    participant DB as MongoDB Atlas

    Note over User,DB: Profile Creation Flow
    User->>NextJS: Uploads Photo & Bio
    NextJS->>Gemini: Sends Image (Base64) + Strict Prompt
    Gemini-->>NextJS: Returns Structured JSON (Aesthetic, Vibe, Tags)
    NextJS->>DB: Upserts User Profile Data
    DB-->>User: Renders AI-Verified Profile Card

    Note over User,DB: Smart Search Flow
    User->>NextJS: Types "Find a Goth in Chicago"
    NextJS->>Gemini: NLP Prompt to construct query
    Gemini-->>NextJS: Returns MongoDB {$regex} Query
    NextJS->>DB: Executes AI-generated Query
    DB-->>User: Returns Matched Users

  
```
---
## 🧠 Engineering & System Design
Beyond just wiring APIs together, Anurupa is built to be a resilient, scalable, and production-ready system. Here are the core engineering decisions:

1. **Deterministic AI via Schema Enforcement**
Large Language Models are notoriously unpredictable. To use Gemini 2.5 Flash in a production database pipeline, strict multi-modal prompt constraints were engineered. The AI is forced to return a stringified JSON object matching a specific schema, entirely bypassing the unpredictability of conversational AI and ensuring database integrity.

2. Database Design & Scalability (MongoDB)
Why NoSQL? The attributes of human "aesthetics" and "vibes" are highly dynamic. MongoDB's document model allows user profiles to hold flexible arrays of tags without requiring rigid, expensive SQL migrations every time a new fashion trend drops.

Search Optimization: The smart search feature relies heavily on regex text matching. To prevent expensive full-collection scans ($COLLSCAN), proper indexing was implemented on high-traffic fields (location, aesthetic, tags) to keep query times in the low milliseconds.

3. Rendering Strategy & Edge Caching
Utilizing the Next.js App Router, the application rendering is strategically split:

Static Site Generation (SSG): Landing and informational pages are pre-compiled and served globally from Vercel's Edge CDN for instant load times.

Server-Side Rendering (SSR) & API Routes: Search feeds and profile generation run dynamically on the server to protect API keys (Gemini, DB) and ensure users always see the freshest data.

4. Zero-Trust Security & RBAC
Integrated Google OAuth 2.0 via NextAuth. The application features a robust Role-Based Access Control (RBAC) system. Admin routes and components are protected by server-side session validation, ensuring unauthorized users cannot access the moderation dashboard or manipulate database records.
---
# 🎮 How to use Anurupa
Sign In: Click "Login" (Secure authentication via Google OAuth).

Upload a Fit Pic: Go to the "Create" tab. Upload a clear picture of yourself. (Note: The AI includes human-verification checks).

Get Analyzed: Hit submit. The AI will analyze your vibe and stamp your profile with your true Aesthetic.

Find Your Match: Use the search bar. Try typing natural language queries like "Vintage lover in Chicago" or "Mysterious streetwear".

---
# 🛠️ Developer Guide: Local Setup
Prerequisites
Node.js (LTS)

A free MongoDB Atlas Cluster

A Google Cloud Console account (for OAuth)

A Google AI Studio API Key (for Gemini)

Installation  

1. Clone the repository  

Bash  
git clone https://github.com/YOUR_GITHUB_USERNAME/Anurupa.git  
cd Anurupa 

2. Install Dependencies  

Bash  
npm install 

3. Configure Environment Variables
   
Create a .env.local file in the root directory. Add the following keys:  

Code snippet  
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0...   
GOOGLE_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com  
GOOGLE_CLIENT_SECRET=your_oauth_secret  
GOOGLE_API_KEY=your_gemini_api_key  
NEXTAUTH_SECRET=any_random_long_string_for_encryption  
NEXTAUTH_URL=http://localhost:3000  

4. Start the Development Server
Bash 
npm run dev  
Open http://localhost:3000 with your browser to see the result.  
------  

Designed & Built by DEVAL  

<img width="76" height="76" alt="MeowDancingCatGIF" src="https://github.com/user-attachments/assets/eae6a262-a315-4f24-8979-5c515384f1b7" />
