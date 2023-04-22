import React from "react";
import { type SectionAreas } from "./DetailsBodyArea";

interface DetailsBodyButtonSelectorProps {
  currentSection: SectionAreas;
  section: SectionAreas;
  setSection: React.Dispatch<React.SetStateAction<SectionAreas>>;
  children?: string;
}

const DetailsBodyButtonSelector: React.FC<DetailsBodyButtonSelectorProps> = ({
  currentSection,
  section,
  setSection,
  children = "",
}) => {
  return (
    <button
      className={` border-b pb-2 ${
        currentSection === section
          ? "border-codemart-600 font-medium text-codemart-600"
          : "border-transparent text-gray-500"
      }`}
      onClick={() => setSection(section)}
    >
      {children}
    </button>
  );
};

export default DetailsBodyButtonSelector;
