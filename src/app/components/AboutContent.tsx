import Link from "next/link";
import React from "react";

const AboutContent = () => {
  return (
    <div className="flex flex-col gap-5 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-center md:text-left text-4xl md:text-5xl uppercase font-semibold text-amber-400">
          Job Tracker
        </h1>
        <h4 className="text-center md:text-left md:text-lg font-light ">
          A better way to stay organized in your job search
        </h4>
      </div>

      <div className="flex flex-col gap-8 p-4 md:p-8 text-lg">
        <div className="flex flex-col gap-4">
          <p>
            Job searching is stressful. Keeping track of roles, links, notes,
            and interview progress doesn&apos;t have to be. Job Tracker helps
            you stay on top of your applications with a clean and simple
            dashboard built to support your job hunt from start to finish.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl text-amber-400 md:px-4 py-2 border-b border-amber-500">
            Why this exists?
          </h3>
          <div className="md:px-4 flex flex-col gap-4">
            <p>
              I built Job Tracker because I struggled with spreadsheets,
              bookmarks, and scattered notes. I wanted a tool that:
            </p>
            <ul className="list-disc list-inside marker:text-amber-400">
              <li>Makes it effortless to add and update job entries</li>
              <li>Keeps everything organized in one place</li>
              <li>Works across devices without losing data</li>
              <li>Helps visualize progress and keep momentum going</li>
            </ul>
            <p>
              Job Tracker is designed for anyone who wants a straightforward
              tool that doesn&apos;t get in the way.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl text-amber-400 md:px-4 py-2 border-b border-amber-500">
            What it does?
          </h3>
          <div className="md:px-4 flex flex-col gap-4">
            <p>With Job Tracker, you can:</p>
            <ul className="list-disc list-inside marker:text-amber-400">
              <li>
                Save job postings with the title, link, and full description
              </li>
              <li>Track status as you move through the pipeline</li>
              <li>Review your updates and last activity at a glance</li>
              <li>Access your data securely with your own account</li>
            </ul>
            <p>
              Future improvements will include search, filters, insights, AI job
              description parsing, and personalized notifications.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl text-amber-400 md:px-4 py-2 border-b border-amber-500">
            Privacy &amp; Ownership
          </h3>
          <div className="md:px-4 flex flex-col gap-4">
            <p>
              Your job search is personal. All data you add stays tied to your
              account and remains private — visible only to you.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl text-amber-400 md:px-4 py-2 border-b border-amber-500">
            Thank you for being here
          </h3>
          <div className="md:px-4 flex flex-col gap-4">
            <p>
              This project is actively evolving, and I&apos;m excited to
              continue improving it.
            </p>
            <p>Feedback and suggestions are always welcome!</p>
            <p>
              If Job Tracker helps even a little in your path to landing your
              next role — mission accomplished.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full h-max text-sm justify-center py-5 border-t border-gray-300">
        <p className="text-center">Made by Pratik Goswami.</p>
        <div className="hidden md:block h-6 border border-amber-600" />
        <div className="flex justify-center gap-4 h-max">
          <Link
            href="https://www.pratikgoswami.dev/"
            target="_blank"
            className="text-blue-400"
          >
            Website
          </Link>
          <div className="h-6 border border-amber-600" />
          <Link
            href="https://www.linkedin.com/in/prtkgoswami"
            target="_blank"
            className="text-blue-400"
          >
            LinkedIn
          </Link>
          <div className="h-6 border border-amber-600" />
          <Link
            href="https://github.com/prtkgoswami"
            target="_blank"
            className="text-blue-400"
          >
            Github
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
