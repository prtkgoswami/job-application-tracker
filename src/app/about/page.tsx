"use client";
import React from "react";
import AboutContent from "@components/AboutContent";

const AboutPage = () => {
  return (
    <div className="flex justify-center items-start">
      <div className="w-full md:w-4/5 px-5 md:px-0 py-8">
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutPage;
