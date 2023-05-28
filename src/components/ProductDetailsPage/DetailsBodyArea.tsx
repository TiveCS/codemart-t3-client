import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { type FeedbacksDataType } from "~/types/FeedbacksData";
import { api } from "~/utils/api";
import { Button } from "../Button";
import FeedbackCard from "../FeedbackCard";
import FeedbackForm from "../FeedbackForm";
import DetailsBodyButtonSelector from "./DetailsBodyButtonSelector";

interface DetailsBodyAreaProps {
  productId: string;
  versionDatas: {
    version: string;
    code_url: string;
  }[];
  body: string | null;
  ownerId: string;
  hasDownloadAccess: boolean;
}

export type SectionAreas = "description" | "versions" | "feedbacks" | "manage";

const DetailsBodyArea: React.FC<DetailsBodyAreaProps> = ({
  body,
  versionDatas,
  ownerId,
  productId,
  hasDownloadAccess,
}) => {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;
  const isOwner = ownerId === session?.user.id;

  const [section, setSection] = useState<SectionAreas>("description");
  const [feedbackPage, setFeedbackPage] = useState(0);

  const getFeedbacks = api.feedbacks.getFeedbacks.useInfiniteQuery({
    productId,
  });

  const { data, isLoading: isFeedbackLoading } = getFeedbacks;

  const feedbacks: FeedbacksDataType[] | undefined = data?.pages[feedbackPage];
  const hasFeedbacks = feedbacks && feedbacks?.length !== 0;

  const showMoreFeedbacks = () => {
    setFeedbackPage(feedbackPage + 1);
  };

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

              {hasDownloadAccess && (
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
          <Link
            href={"/products/[id]/delete"}
            as={`/products/${productId}/delete`}
          >
            <Button
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              style="outline"
            >
              Delete Product
            </Button>
          </Link>
        </div>
      )}

      {section === "feedbacks" && (
        <div id="product-feedbacks">
          {isAuthed && !isOwner && (
            <FeedbackForm productId={productId} getFeedbacks={getFeedbacks} />
          )}

          <hr />

          <div id="feedback-list" className="mt-12 flex flex-col gap-y-6">
            {hasFeedbacks ? (
              feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))
            ) : (
              <div className="text-center">
                <p>No feedbacks</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DetailsBodyArea;
