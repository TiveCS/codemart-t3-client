import { type RequestThread } from "@prisma/client";
import Link from "next/link";

interface RequestThreadItemProps {
  thread: RequestThread;
}

const RequestThreadItem = ({ thread }: RequestThreadItemProps) => {
  return (
    <Link
      href={"/request/view/[id]"}
      as={`/request/view/${thread.id}`}
      className="group"
    >
      <div className="rounded bg-white px-8 py-6 shadow group-hover:bg-codemart-50">
        <p>{thread.title}</p>
        <p>{thread.authorId}</p>
      </div>
    </Link>
  );
};

export default RequestThreadItem;
