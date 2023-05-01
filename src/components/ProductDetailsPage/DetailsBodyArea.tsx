import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../Button";
import DetailsBodyButtonSelector from "./DetailsBodyButtonSelector";
import { type PurchaseHistory } from "@prisma/client";

interface DetailsBodyAreaProps {
  productId: string;
  versionDatas: {
    version: string;
    code_url: string;
  }[];
  body: string | null;
  ownerId: string;
  userPurchase:
    | PurchaseHistory
    | {
        id: string;
        status: string;
      }
    | undefined;
}

export type SectionAreas = "description" | "versions" | "feedbacks" | "manage";

const DetailsBodyArea: React.FC<DetailsBodyAreaProps> = ({
  body,
  versionDatas,
  ownerId,
  productId,
  userPurchase,
}) => {
  const { data: session } = useSession();
  const isOwner = ownerId === session?.user.id;

  const [section, setSection] = useState<SectionAreas>("description");

  return (
    <>
      <div id="section-changer" className="mt-4">
        <div className="grid grid-flow-row grid-cols-2 items-center gap-y-4 gap-x-2 md:grid-flow-col md:grid-cols-4">
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

          {isOwner && (
            <DetailsBodyButtonSelector
              currentSection={section}
              section="manage"
              setSection={setSection}
            >
              Manage
            </DetailsBodyButtonSelector>
          )}
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

              {(isOwner ||
                (userPurchase !== undefined &&
                  userPurchase.status === "capture")) && (
                <a href={data.code_url} target="_blank" rel="noreferrer">
                  <Button style="outline">Download</Button>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {section === "manage" && (
        <div id="product-manage" className="mt-6 flex flex-col gap-y-3">
          <Link href={`/products/[id]/edit`} as={`/products/${productId}/edit`}>
            <Button style="outline">Edit Details</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default DetailsBodyArea;
