import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PrivacyContent from '@/components/PrivacyContent';

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

      <PrivacyContent />
    </div>
  );
}
