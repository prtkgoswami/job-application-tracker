"use client"
import React, { ReactNode } from "react";
import { toast } from "react-toastify";

type Props = {
  children: ReactNode;
  textToCopy: string;
  successToastMsg?: string;
  failureToastMsg?: string;
};

const ClickToCopyText = ({
  children,
  textToCopy,
  successToastMsg,
  failureToastMsg,
}: Props) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(successToastMsg ?? "Text Copied to Clipboard");
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_err) {
      console.error(failureToastMsg ?? `Could not Copy Text to Clipboard`);
    }
  };
  return <span className="cursor-pointer w-full" onClick={handleClick}>{children}</span>;
};

export default ClickToCopyText;
