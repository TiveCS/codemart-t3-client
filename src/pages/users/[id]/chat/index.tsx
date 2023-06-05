import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import ChatThreadItem from "~/components/ChatPage/ChatThreadItem";
import { api } from "~/utils/api";

interface UserChatListProps {
  userId: string;
}

const UserChatList: NextPage<UserChatListProps> = ({ userId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: chatThreads, isLoading } =
    api.users.getUserChatThreads.useQuery();

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    void router.push("/auth");
  }

  if (session && session?.user.id !== userId) {
    void router.push(`/users/${session?.user.id}/chat`);
  }

  const isChatEmpty = chatThreads?.length === 0;

  return (
    <>
      <Head>
        <title>Your Chat | CodeMart</title>
      </Head>

      <div
        id="user-chat"
        className="mx-auto min-h-md max-w-6xl bg-white shadow"
      >
        <div className="px-8 py-6">
          <p className="mb-4 text-xl font-medium">Chat List</p>

          <hr />
        </div>

        {isChatEmpty && (
          <div id="chat-empty" className="px-8 pb-6">
            <h3>No chats yet</h3>
            <p>Start a new chat by clicking on a user</p>
          </div>
        )}

        {chatThreads?.map((thread) => (
          <ChatThreadItem key={thread.id} userId={userId} thread={thread} />
        ))}
      </div>
    </>
  );
};

export default UserChatList;

UserChatList.getInitialProps = ({ query }) => {
  return {
    userId: query.id as string,
  };
};
