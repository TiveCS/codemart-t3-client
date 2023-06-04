import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";

interface UserPageProps {
  userId: string;
}

const UserPage: NextPage<UserPageProps> = ({ userId }) => {
  const { data: session } = useSession();
  const { data: user, isLoading } = api.users.getUserById.useQuery({ userId });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>404</p>;
  }

  const isSameUser = session?.user.id === user.id;

  return (
    <>
      <Head>
        <title>{user.name} | CodeMart</title>
      </Head>

      <div className="mx-auto flex flex-col gap-y-8 bg-white px-8 py-8 shadow md:max-w-6xl">
        <div
          id="user-profile"
          className="grid grid-flow-row items-center gap-y-4 md:grid-cols-12 md:gap-y-0"
        >
          <Image
            src={user.image as string}
            alt={user.name as string}
            width={48}
            height={48}
            className="mx-auto rounded-full md:col-span-1 md:mx-0"
          />

          <div className="text-center md:col-span-9 md:text-left">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>

          <Link
            href={"/users/[id]/chat"}
            as={`/users/${userId}/chat`}
            className="md:col-span-2"
          >
            <Button>{isSameUser ? "Check Chat" : "Send Message"}</Button>
          </Link>
        </div>

        <hr />

        <div id="user-products">
          <p className="text-xl font-semibold">Products</p>

          <div className="grid grid-flow-row gap-y-4 md:grid-cols-2 md:gap-y-0">
            <p>No Products</p>
          </div>
        </div>
      </div>
    </>
  );
};

UserPage.getInitialProps = ({ query }) => {
  return {
    userId: query.id as string,
  };
};

export default UserPage;
