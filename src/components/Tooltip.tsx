import React, { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  content: string;
  position?: string;
  children: ReactNode;
};

const POSITION_CLASSES: Record<string, Record<string, string>> = {
  right: {
    tip: "top-1/2 left-full -translate-y-1/2 ml-3",
    indicator: "top-1/2 left-0 -translate-x-1/2  -translate-y-1/2",
  },
  left: {
    tip: "top-1/2 right-full -translate-y-1/2 mr-3",
    indicator: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  },
  top: {
    tip: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    indicator: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  },
  bottom: {
    tip: "top-full left-1/2 -translate-x-1/2 mt-3",
    indicator: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  },
};

const Tooltip = ({ content, position = "right", children }: Props) => {
  const [isVisisble, setIsVisible] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showTooltip = () => {
      setIsVisible(true);
    };
    const hideTooltip = () => {
      setIsVisible(false);
    };

    if (childRef.current) {
      childRef.current.addEventListener("mouseover", showTooltip);
      childRef.current.addEventListener("mouseleave", hideTooltip);

      return () => {
        childRef.current?.removeEventListener("mouseover", showTooltip);
        childRef.current?.removeEventListener("mouseleave", hideTooltip);
      };
    }
  }, [childRef.current]);
  return (
    <div className="relative">
      <div ref={childRef}>{children}</div>
      {isVisisble && (
        <div
          className={`absolute ${POSITION_CLASSES[position].tip} w-max flex items-center z-50`}
        >
          <div className="relative">
            <div
              className={`w-3 aspect-square rotate-45 bg-amber-600 absolute -z-10 ${POSITION_CLASSES[position].indicator}`}
            />
            <div className="w-full px-3 py-1 bg-amber-600 text-gray-800 text-sm">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
