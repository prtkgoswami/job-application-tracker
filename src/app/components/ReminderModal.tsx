import React from "react";

type ReminderModalProps = {
  wishlistCount: number;
  isVisible: boolean;
  onClose: () => void;
};

const ReminderModal = ({
  wishlistCount,
  isVisible,
  onClose,
}: ReminderModalProps) => {
  if (!isVisible) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800/40">
      <div className="w-2/3 bg-gray-100 h-170 rounded-lg relative">
        ReminderModal
      </div>
    </div>
  );
};

export default ReminderModal;
