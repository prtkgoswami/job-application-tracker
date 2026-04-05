import React, { useState } from "react";

type Props = {
  listData: {
    all: string[];
    active: string[];
  };
};

const CompaniesTab = ({ listData }: Props) => {
  const [activeTab, setActiveTab] = useState<keyof typeof listData>("active");
  const tabs = Object.keys(listData);
  return (
    <div>
      <div className="flex items-center justify-center w-full gap-4">
        {tabs.map((title) => (
          <button
            key={`tab-control-${title}`}
            className={`capitalize cursor-pointer w-20 ${title !== activeTab ? "hover:text-amber-400" : ""} ${title === activeTab ? "text-amber-500" : ""}`}
            onClick={() => setActiveTab(title as keyof typeof listData)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-5">
        {listData[activeTab].map((data) => (
          <p key={`company-${data}`}>{data}</p>
        ))}
      </div>
    </div>
  );
};

export default CompaniesTab;
