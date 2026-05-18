"use client";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import ClickToCopyText from "@components/ClickToCopyText";
import { logAnalyticsEvent } from "@lib/analytics";

export default function EmailContact() {
  return (
    <ClickToCopyText
      textToCopy="jobtrackrapp@gmail.com"
      successToastMsg="Feedback Email copied"
      onClick={() => logAnalyticsEvent("feedback_email_clicked")}
    >
      <span className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer inline-flex items-center gap-2 font-medium bg-zinc-800/50 px-3 py-1 rounded-md border border-zinc-700">
        jobtrackrapp@gmail.com <FontAwesomeIcon icon={faCopy} />
      </span>
    </ClickToCopyText>
  );
}
