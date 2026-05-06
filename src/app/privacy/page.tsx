import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Privacy Policy - JobTrackr",
  description: "Read the Privacy Policy for JobTrackr to understand how your data is collected, used, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-4 text-xl font-bold text-white">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          </Link>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-cyan-500" />
            <span>JobTrackr</span>
          </div>
        </div>
      </header>

      <main className="grow w-full max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-12 shadow-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-zinc-500 mb-10 font-mono">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-8 leading-relaxed text-base md:text-lg">
            <p className="text-zinc-300 text-lg md:text-xl font-medium border-l-4 border-cyan-500 pl-4 py-1">
              JobTrackr provides a private and secure way to help individuals track their job applications. This Privacy Policy explains how your data is collected, used, and protected.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Data We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
                <li>Email address for authentication</li>
                <li>Job application data manually entered by you (job title, link, notes, status)</li>
                <li>Anonymous usage analytics to improve the app</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                How Your Data Is Used
              </h2>
              <p className="text-zinc-400">
                We use your information only for authentication, securely storing your job tracking data, and improving app performance. We do not sell your data or share it with third parties for advertising.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Data Security
              </h2>
              <p className="text-zinc-400">
                All data is stored securely using Google Firebase services with encryption in transit and at rest. You can delete your data anytime by deleting your account.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Third-Party Services
              </h2>
              <p className="text-zinc-400">
                JobTrackr uses Firebase Authentication, Firestore, and Google Analytics to provide core functionality and improve the user experience.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Children&apos;s Privacy
              </h2>
              <p className="text-zinc-400">
                JobTrackr is not intended for users under 13. We do not knowingly collect data from children.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                Policy Changes
              </h2>
              <p className="text-zinc-400">
                We may update this Privacy Policy as the app improves. The latest version will always remain available on this page.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Contact Us
              </h2>
              <p className="text-zinc-400">
                For privacy questions or support, email us at:{" "}
                <a href="mailto:jobtrackrapp@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  jobtrackrapp@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 md:px-6 text-center text-zinc-500 mt-auto">
        <p>&copy; {new Date().getFullYear()} JobTrackr. All rights reserved.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link href="/" className="hover:text-zinc-300 transition-colors text-sm">Home</Link>
          <Link href="/about" className="hover:text-zinc-300 transition-colors text-sm">About</Link>
        </div>
      </footer>
    </div>
  );
}
