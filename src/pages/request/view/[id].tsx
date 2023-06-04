import { type NextPage } from "next";
import Head from "next/head";
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
      <Head>
        <title>{thread.title} | CodeMart</title>
      </Head>

      <p>{thread.title}</p>

      <p>{thread.content}</p>
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
