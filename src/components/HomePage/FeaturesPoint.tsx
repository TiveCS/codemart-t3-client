import React from "react";

import SafeIcon from "../Images/SafeIcon";
import ChatIcon from "../Images/ChatIcon";
import SrcIcon from "../Images/SrcIcon";
import SearchIcon from "../Images/SearchIcon";

interface FeaturesPointProps {
  title: string;
  description: string;
  icon: "Safe" | "Chat" | "Src" | "Search";
}

const FeaturesPoint: React.FC<FeaturesPointProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row space-x-4">
        {icon === "Safe" && <SafeIcon />}
        {icon === "Chat" && <ChatIcon />}
        {icon === "Src" && <SrcIcon />}
        {icon === "Search" && <SearchIcon />}

        <h4 className="text-xl font-medium lg:text-2xl">{title}</h4>
      </div>

      <p className="leading-relaxed">{description}</p>
    </div>
  );
};

export default FeaturesPoint;
