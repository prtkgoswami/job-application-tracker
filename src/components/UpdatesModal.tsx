import React from "react";
import Modal from "./Modal";

type UpdatesModalProps = {
  wishlistCount: number;
  isVisible: boolean;
  onClose: () => void;
};

const UpdatesModal = ({
  isVisible,
  onClose,
}: UpdatesModalProps) => {
  if (!isVisible) {
    return <></>;
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div></div>
    </Modal>
  );
};

export default UpdatesModal;
