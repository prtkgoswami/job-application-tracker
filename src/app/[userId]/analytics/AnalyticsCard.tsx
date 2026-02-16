import React, { ReactNode } from "react";

type Props = {
  title: string;
  showCount?: boolean;
  count?: number;
  children: ReactNode;
  height?: number;
  onClick?: () => void;
};

const AnalyticsCard = ({
  title,
  showCount,
  count,
  children,
  height,
  onClick,
}: Props) => {
  return (
    <div
      className="h-max w-full flex flex-col gap-2 p-4 border-2 border-amber-500 rounded-lg"
      onClick={onClick}
    >
      <h3 className="text-xl text-amber-500">
        {title}
        {showCount && <span className="ml-1">- {count}</span>}
      </h3>
      <div className="flex flex-col" style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
};

export default AnalyticsCard;
