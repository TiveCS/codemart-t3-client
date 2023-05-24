import { type Feedback } from "@prisma/client";

export type FeedbacksDataType = Feedback & {
  reviewer: {
    name: string | null;
    image: string | null;
  };
};
