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
      className={` ${
        currentSection === section
          ? "font-medium text-blue-500"
          : "text-gray-500"
      }`}
      onClick={() => setSection(section)}
    >
      {children}
    </button>
  );
};

export default DetailsBodyButtonSelector;
