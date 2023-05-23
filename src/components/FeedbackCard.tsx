import { type Feedback } from "@prisma/client";

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return <div></div>;
};

export default FeedbackCard;
