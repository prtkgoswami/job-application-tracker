import Modal from '@/app/components/Modal';
import React, { useState } from 'react'

export type Feedback = {
    reasonCode: string;
    otherReasonString: string;
    additionalFeedback: string;
  }

type Props = {
    isVisible: boolean;
    onClose: (feedbackPayload: Feedback) => void;
}


const REASONS_LIST = [
  { key: "found_job", value: "I found a job" },
  {
    key: "paused_job_search",
    value: "I'm not actively job searching right now",
  },
  {
    key: "using_other_tool",
    value: "I prefer to track applications elsewhere",
  },
  { key: "not_useful", value: "I didn't find it useful for my workflow" },
  { key: "missing_features", value: "Missing features I need" },
  { key: "technical_issues", value: "I had technical issues" },
  { key: "other", value: "Other" },
];

const DeleteFeedbackModal = ({isVisible, onClose}: Props) => {
  const [selectedReasonCode, setSelectedReasonCode] = useState("none");
  const [otherReasonString, setOtherReasonString] = useState("");
  const [additionalFeedback, setAdditionalFeedback] = useState("");

  const handleSubmit = () => {
    const payload: Feedback = {
        reasonCode: selectedReasonCode,
        otherReasonString,
        additionalFeedback
    }
    onClose(payload)
  }

  const handleSkip = () => {
    const payload: Feedback = {
        reasonCode: selectedReasonCode,
        otherReasonString,
        additionalFeedback
    }
    onClose(payload)
  }
  
  return (
    <Modal
        isVisible={isVisible}
        title="Danger"
        modalClasses="md:w-1/2 shadow-lg shadow-gray-900"
        bodyClasses="flex-col md:p-8"
        theme="dark"
        onClose={handleSkip}
        hideHeader
      >
        <h2 className="text-amber-400 text-2xl">Before you go...</h2>
        <p className="mt-4">
          We'd love to learn why you're leaving JobTrackr — it helps us improve
          the experience for everyone.
          <br />
          This step is completely optional and only takes a moment.
        </p>
        <p className="text-amber-400 mt-5 mb-4">
          Why are you deleting your account?
        </p>
        <div className="grid grid-cols-2 gap-2 px-5">
          {REASONS_LIST.map(({ key, value }) => (
            <div
              key={key}
              className={`flex flex-col gap-2 ${
                key === "other" ? "col-span-2" : ""
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delete-reason"
                  value={key}
                  checked={selectedReasonCode === key}
                  onChange={(e) => setSelectedReasonCode(e.target.value)}
                  className="cursor-pointer"
                />
                <span>{value}</span>
              </label>
              {key === "other" && selectedReasonCode === "other" && (
                <input
                  type="text"
                  name="reason-other-string"
                  value={otherReasonString}
                  onChange={(e) => setOtherReasonString(e.target.value)}
                  className="px-2 py-1 border-b border-gray-400"
                  placeholder="Enter reason here (Optional)"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-8 gap-4">
          <p className="text-amber-400 text-left w-full">
            Anything you'd like to share?{" "}
            <span className="italic">(optional)</span>
          </p>
          <textarea
            name=""
            id=""
            className="text-gray-100 border border-gray-400 placeholder:text-gray-400 w-[90%] resize-none overflow-y-auto p-2 h-30 rounded-md focus-within:outline-none focus-within:border-amber-400"
            placeholder="Help us improve — what could we do better?"
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-end items-center mt-8">
          <button
            type="button"
            className="px-4 py-2 text-gray-800 bg-amber-400 disabled:bg-gray-400 hover:bg-amber-500 text-lg cursor-pointer uppercase w-40 rounded-lg"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            type="button"
            className="px-4 py-2 text-gray-800 bg-amber-400 disabled:bg-gray-400 hover:bg-amber-500 text-lg cursor-pointer uppercase w-40 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </Modal>
  )
}

export default DeleteFeedbackModal