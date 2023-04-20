import { useState } from "react";
import DetailsBodyButtonSelector from "./DetailsBodyButtonSelector";
import { Button } from "../Button";

interface DetailsBodyAreaProps {
  versionDatas: {
    version: string;
    code_url: string;
  }[];
  body: string | null;
}

export type SectionAreas = "description" | "versions" | "feedbacks";

const DetailsBodyArea: React.FC<DetailsBodyAreaProps> = ({
  body,
  versionDatas,
}) => {
  const [section, setSection] = useState<SectionAreas>("description");

  return (
    <>
      <div id="section-changer" className="mt-4">
        <div className="flex flex-row items-center justify-evenly">
          <DetailsBodyButtonSelector
            currentSection={section}
            section="description"
            setSection={setSection}
          >
            Description
          </DetailsBodyButtonSelector>

          <DetailsBodyButtonSelector
            currentSection={section}
            section="versions"
            setSection={setSection}
          >
            Versions
          </DetailsBodyButtonSelector>

          <DetailsBodyButtonSelector
            currentSection={section}
            section="feedbacks"
            setSection={setSection}
          >
            Feedbacks
          </DetailsBodyButtonSelector>
        </div>
      </div>

      {section === "description" && (
        <div
          id="product-description"
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: body ?? "" }}
        ></div>
      )}

      {section === "versions" && (
        <div id="product-versions" className="mt-6 flex flex-col gap-y-3">
          {versionDatas.map((data, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between"
            >
              <span className="font-medium text-blue-500">{data.version}</span>
              <a href={data.code_url} target="_blank" rel="noreferrer">
                <Button style="outline">Download</Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DetailsBodyArea;
