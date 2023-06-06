import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";
import ProductCard from "~/components/ProductCard";

interface UserPageProps {
  userId: string;
}

const UserPage: NextPage<UserPageProps> = ({ userId }) => {
  const { data: findChatWithUserData } = api.chat.findChatWithUser.useQuery({
    userId,
  });
  const newChatThreadId = createId();
  const [newChatIsLoading, setNewChatIsLoading] = useState(false);

  const { data: session } = useSession();
  const { data: user, isLoading } = api.users.getUserById.useQuery({ userId });

  const { data: userProducts, isLoading: isGetUserProductsLoading } =
    api.products.getUserProducts.useQuery({
      ownerId: userId,
    });

  const router = useRouter();
  const newChatThread = api.chat.newChatThread.useMutation({
    onSuccess: () => {
      setNewChatIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setNewChatIsLoading(false);
    },
    onMutate: () => {
      setNewChatIsLoading(true);
    },
  });

  if (isLoading || isGetUserProductsLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>404</p>;
  }

  const isSameUser = session?.user.id === user.id;

  const handleSendMessage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      e.preventDefault();
      return void router.push("/auth");
    }

    if (findChatWithUserData) {
      return;
    }

    const audienceIds = [session?.user.id, user.id];

    void newChatThread.mutate({ audienceIds, threadId: newChatThreadId });
  };

  return (
    <>
      <Head>
        <title>{user.name} | CodeMart</title>
      </Head>

      <div className="mx-auto flex min-h-md flex-col gap-y-8 bg-white px-8 py-8 shadow md:max-w-6xl">
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

          {isSameUser ? (
            <Link
              href={"/users/[id]/chat"}
              as={`/users/${userId}/chat`}
              className="md:col-span-2"
            >
              <Button>Check Chat</Button>
            </Link>
          ) : (
            <Link
              href={"/chat/[id]"}
              as={`/chat/${
                findChatWithUserData ? findChatWithUserData.id : newChatThreadId
              }`}
              className="md:col-span-2"
              onClick={handleSendMessage}
            >
              <Button isLoading={newChatIsLoading}>Send Message</Button>
            </Link>
          )}
        </div>

        <hr />

        <div id="user-products">
          <p className="text-xl font-semibold">Products</p>

          <div className="mt-6 grid grid-flow-row gap-y-4 md:grid-cols-3 md:gap-y-0">
            {userProducts?.length === 0 && <p>No products</p>}

            {userProducts?.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                className="md:col-span-1"
              />
            ))}
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
