"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import EmailContact from "./EmailContact";

const AboutContent = () => {
  return (
    <>
    <main className="grow w-full max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Top Banner / Hero */}
          <div className="bg-zinc-800/50 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 border-b border-zinc-800">
            <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                About <span className="text-cyan-500">JobTrackr</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-light">
                A better way to stay organized in your job search
              </p>
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 relative shrink-0">
              <Image
                src="/jobTrackr_logo.png"
                alt="JobTrackr Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-12 space-y-12 text-base md:text-lg leading-relaxed text-zinc-400">
            
            <section>
              <p className="text-zinc-300 text-lg md:text-xl font-medium">
                Job searching is stressful. Keeping track of roles, links, notes,
                and interview progress doesn&apos;t have to be. JobTrackr helps you
                stay on top of your applications with a clean and simple dashboard
                built to support your job hunt from start to finish.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Why this exists?
              </h2>
              <div className="space-y-4">
                <p>
                  I built JobTrackr because I struggled with spreadsheets, bookmarks, and scattered notes. I wanted a tool that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 text-zinc-300">
                  <li>Makes it effortless to add and update job entries</li>
                  <li>Keeps everything organized in one place</li>
                  <li>Works across devices without losing data</li>
                  <li>Helps visualize progress and keep momentum going</li>
                </ul>
                <p>
                  JobTrackr is designed for anyone who wants a straightforward tool that doesn&apos;t get in the way.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                What it does?
              </h2>
              <div className="space-y-4">
                <p>With JobTrackr, you can:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 text-zinc-300">
                  <li>Save job postings with the title, link, and full description</li>
                  <li>Track status as you move through the pipeline</li>
                  <li>Review your updates and last activity at a glance</li>
                  <li>Access your data securely with your own account</li>
                </ul>
                <p className="italic text-zinc-500 mt-4">
                  Future improvements will include search, filters, insights, AI job description parsing, and personalized notifications.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Privacy &amp; Ownership
              </h2>
              <p>
                Your job search is personal. All data you add stays tied to your account and remains private — visible only to you.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-zinc-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Thank you for being here
              </h2>
              <div className="space-y-4">
                <p>
                  This project is actively evolving, and I&apos;m excited to continue improving it.
                </p>
                <div className="flex flex-col items-start gap-3">
                  <span>Feedback and suggestions are always welcome! Email to:</span> 
                  <EmailContact />
                </div>
                <p className="font-medium text-cyan-500 mt-6">
                  If JobTrackr helps even a little in your path to landing your next role — mission accomplished.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 md:px-6 text-center text-zinc-500 mt-auto">
        <p className="mb-4">Made by Pratik Goswami.</p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          <Link href="https://www.pratikgoswami.dev/" target="_blank" className="hover:text-zinc-300 transition-colors text-sm">Website</Link>
          <div className="h-4 border-r border-zinc-700 hidden sm:block"></div>
          <Link href="https://www.linkedin.com/in/prtkgoswami" target="_blank" className="hover:text-zinc-300 transition-colors text-sm">LinkedIn</Link>
          <div className="h-4 border-r border-zinc-700 hidden sm:block"></div>
          <Link href="https://github.com/prtkgoswami" target="_blank" className="hover:text-zinc-300 transition-colors text-sm">Github</Link>
          <div className="h-4 border-r border-zinc-700 hidden sm:block"></div>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors text-sm">Privacy Policy</Link>
        </div>
      </footer></>
  );
};

export default AboutContent;
