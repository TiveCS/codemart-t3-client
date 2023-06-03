import { type NextPage } from "next";
import { api } from "~/utils/api";

interface RequestThreadPageProps {
  id: string;
}

const RequestThreadPage: NextPage<RequestThreadPageProps> = ({
  id,
}: RequestThreadPageProps) => {
  const { data: thread, isLoading } =
    api.productRequests.getRequestById.useQuery({
      id,
    });

  if (isLoading) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  if (!thread) {
    return (
      <>
        <p>404</p>
      </>
    );
  }

  return (
    <>
      <p>{thread.title}</p>
    </>
  );
};

export default RequestThreadPage;

RequestThreadPage.getInitialProps = (ctx) => {
  const query = ctx.query;
  const id = query.id as string;

  return {
    id,
  };
};
