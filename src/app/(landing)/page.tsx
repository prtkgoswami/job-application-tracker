import Link from "next/link";
import AuthRedirect from "./AuthRedirect";
import LearnMoreButton from "./LearnMoreButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChartLine,
  faCalendarCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const metadata = {
  title: "JobTrackr - Master Your Job Search",
  description:
    "Track your applications, schedule interviews, and analyze your job hunt progress with JobTrackr.",
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JobTrackr",
    operatingSystem: "Web browser",
    applicationCategory: "BusinessApplication",
    description:
      "Track your applications, schedule interviews, and analyze your job hunt progress with JobTrackr.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var userId = localStorage.getItem('jobTrackr_userId');
            if (userId) {
              window.location.replace('/' + userId + '/jobs');
            }
          `
        }}
      />
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <AuthRedirect />
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <FontAwesomeIcon icon={faBriefcase} className="text-amber-400" />
          <span>JobTrackr</span>
        </div>
        <nav>
          <Link
            href="/auth?mode=login"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors mr-4"
          >
            Login
          </Link>
          <Link
            href="/auth?mode=register"
            className="text-sm font-medium bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-md transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="grow">
        {/* Hero Section */}
        <section className="px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Take Control of Your{" "}
            <span className="text-cyan-500">Job Search</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-10">
            Stop losing track of your applications. Organize your links, manage
            your interview schedule, and visualize your progress all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Link
              href="/auth"
              className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg shadow-cyan-500/20"
            >
              Start Tracking Now
            </Link>
            <LearnMoreButton />
          </div>
        </section>

        {/* Placeholder for App Screenshot */}
        <section className="px-4 md:px-6 pb-16 md:pb-24 max-w-6xl mx-auto aspect-video flex flex-col">
          <div className="w-full h-full flex flex-col border border-zinc-800 rounded-2xl">
            {/* Decorative UI elements for the placeholder */}
            <div className=" w-full h-12 bg-zinc-800/50 border-b border-zinc-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="w-full grow bg-zinc-900 overflow-hidden shadow-2xl flex items-center justify-center relative group">
              <Image
                src={"/job_tracker_dashboard.png"}
                fill
                alt="JobTrackr Dashboard"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-4 md:px-6 py-16 md:py-24 bg-zinc-900/50 border-y border-zinc-800"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-16">
              Everything you need to land your dream job
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="relative overflow-hidden group bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="absolute -bottom-1 -right-3 origin-bottom-right text-cyan-500/20 transition-transform duration-500 group-hover:scale-125">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[8rem]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    Track Applications
                  </h3>
                  <p className="text-zinc-300">
                    Log every job you apply to. Keep track of URLs, job
                    descriptions, salaries, and current status in a clean,
                    organized table.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden group bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="absolute -bottom-1 -right-6 origin-bottom-right text-amber-400/20 transition-transform duration-500 group-hover:scale-125">
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-[8rem]"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    Manage Interviews
                  </h3>
                  <p className="text-zinc-300">
                    Never miss an interview. Schedule upcoming calls, technical
                    assessments, and final rounds directly in your calendar.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden group bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="absolute -bottom-1 -right-3 origin-bottom-right text-amber-500/20 transition-transform duration-500 group-hover:scale-125">
                  <FontAwesomeIcon icon={faChartLine} className="text-[8rem]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    Visual Analytics
                  </h3>
                  <p className="text-zinc-300">
                    Gain insights into your job search. View your conversion
                    rates, application volume over time, and status breakdowns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Feedback Section */}
        <section className="px-4 md:px-6 py-16 md:py-24 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            We would Love Your Feedback
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            JobTrackr is constantly improving. If you have feature requests,
            found a bug, or just want to say hi, reach out to us!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 px-4 md:px-6 py-4 rounded-xl max-w-fit mx-auto break-all">
            <FontAwesomeIcon icon={faEnvelope} className="text-zinc-400" />
            <a
              href="mailto:jobtrackrapp@gmail.com"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              jobtrackrapp@gmail.com
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 md:px-6 text-center text-zinc-500">
        <p>&copy; {new Date().getFullYear()} JobTrackr. All rights reserved.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link
            href="/privacy"
            className="hover:text-zinc-300 transition-colors text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/about"
            className="hover:text-zinc-300 transition-colors text-sm"
          >
            About
          </Link>
        </div>
      </footer>
    </div>
    </>
  );
}
