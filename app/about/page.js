"use client";

import { ArrowLeft, Linkedin, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-neutral-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to App
          </Link>

          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            About Anurupa
          </h1>

          <p className="text-xl text-neutral-300 leading-relaxed">
            Anurupa is a modern full-stack platform built with Next.js and Tailwind CSS.
            It uses MongoDB Atlas for data storage and NextAuth.js for secure Google authentication.
            The app integrates Google’s Gemini API for real-time AI image verification, ensuring
            human authenticity and age compliance. Deployment is handled via Vercel with automated
            CI/CD pipelines connected to GitHub for fast, global updates.
          </p>
        </div>

        {/* Developer Profile */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            👨‍💻 The Developer
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              D
            </div>

            <div>
              <h3 className="text-2xl font-bold">Deval</h3>
              <p className="text-neutral-400 mb-4">
                Computer enthusiast who enjoys building innovative things.
                Strength: creativity. Weakness: procrastination.
              </p>

              <a
                href="https://www.linkedin.com/in/devalsinh-sindha-373694280/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#0077b5] hover:bg-[#006396] text-white px-6 py-2 rounded-full font-bold transition"
              >
                <Linkedin size={18} className="mr-2" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="text-pink-500" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer group">
              <summary className="font-bold text-lg group-hover:text-pink-500 transition">
                How does the AI verification work?
              </summary>
              <p className="text-neutral-400 mt-2">
                We use Google’s Gemini Vision API to analyze image authenticity,
                facial features, and quality to confirm that uploaded images are real and human.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer group">
              <summary className="font-bold text-lg group-hover:text-pink-500 transition">
                Is it free to join?
              </summary>
              <p className="text-neutral-400 mt-2">
                Yes. Browsing and profile creation are completely free.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer group">
              <summary className="font-bold text-lg group-hover:text-pink-500 transition">
                How can I delete my data?
              </summary>
              <p className="text-neutral-400 mt-2">
                You can contact the admin or remove your account directly from profile settings.
              </p>
            </details>

            <details className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer group">
              <summary className="font-bold text-lg group-hover:text-pink-500 transition">
                How was it built ?
              </summary>
              <p className="text-neutral-400 mt-2">
                I used a lot of AI. Keep it between us. please.
              </p>
            </details>

          </div>
        </div>

      </div>
    </div>
  );
}
