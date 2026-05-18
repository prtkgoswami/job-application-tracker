"use client"
import PrivacyContent from '@/components/PrivacyContent'
import { faArrowLeft, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation'

const PrivacyPage = () => {
  const router = useRouter();
  return (
    <div className=" h-full bg-zinc-950 text-zinc-300 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-4 text-xl font-bold text-white">
          <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          </button>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-cyan-500" />
            <span>JobTrackr</span>
          </div>
        </div>
      </header>

      <PrivacyContent />
    </div>
  )
}

export default PrivacyPage