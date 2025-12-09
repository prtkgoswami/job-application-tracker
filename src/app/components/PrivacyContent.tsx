import React from 'react'

const PrivacyContent = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-4xl font-bold text-amber-400 mb-6">
        Privacy Policy
      </h1>

      <p className="mb-4 text-sm text-gray-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-4 leading-relaxed">
        <p>
          JobTrackr provides a private and secure way to help individuals track
          their job applications. This Privacy Policy explains how your data is
          collected, used, and protected.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Data We Collect
        </h2>
        <ul className="list-disc list-inside">
          <li>Email address for authentication</li>
          <li>
            Job application data manually entered by you (job title, link,
            notes, status)
          </li>
          <li>Anonymous usage analytics to improve the app</li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          How Your Data Is Used
        </h2>
        <p>
          We use your information only for authentication, securely storing your
          job tracking data, and improving app performance. We do not sell your
          data or share it with third parties for advertising.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Data Security
        </h2>
        <p>
          All data is stored securely using Google Firebase services with
          encryption in transit and at rest. You can delete your data anytime by
          deleting your account.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Third-Party Services
        </h2>
        <p>
          JobTrackr uses Firebase Authentication, Firestore, and Google
          Analytics to provide core functionality and improve the user
          experience.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Children’s Privacy
        </h2>
        <p>
          JobTrackr is not intended for users under 13. We do not knowingly
          collect data from children.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Policy Changes
        </h2>
        <p>
          We may update this Privacy Policy as the app improves. The latest
          version will always remain available on this page.
        </p>

        <h2 className="text-xl font-semibold text-amber-500 mt-6">
          Contact Us
        </h2>
        <p>
          For privacy questions or support, email us at:{" "}
          <a href="mailto:jobtrackrapp@gmail.com" className="text-amber-400 underline">
            jobtrackrapp@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}

export default PrivacyContent