import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import ChatMessageItem from "~/components/ChatPage/ChatMessageItem";
import { useSocket } from "~/hooks/useSocket";
import { api } from "~/utils/api";

interface ChatThreadPageProps {
  threadId: string;
}

const ChatThreadPage: NextPage<ChatThreadPageProps> = ({ threadId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { socket } = useSocket();
  const chatThread = api.chat.getChatThread.useQuery({ threadId });
  const messagesContainer = useRef<HTMLDivElement>(null);

  const newChatMessage = api.chat.newChatMessage.useMutation({
    onSuccess: (data) => {
      if (data) {
        socket?.emit("createdMessage", data);
      }
    },
  });

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");

      socket?.on("newIncomingMessage", async () => {
        console.log("newIncomingMessage");

        await chatThread.refetch();
        messagesContainer.current?.scrollTo({
          top: messagesContainer.current.scrollHeight,
          behavior: "smooth",
        });
      });
    };

    void socketInitializer();
  }, [chatThread, socket]);

  if (chatThread.isLoading || status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    void router.push("/auth");
  }

  const { data } = chatThread;

  if (!data?.thread) {
    return <p>404</p>;
  }

  const { thread, messages } = data;

  if (!socket) {
    return <p>Connecting...</p>;
  }

  const audienceListString = thread.audienceList
    .filter((audience) => audience.id !== session?.user.id)
    .map((audience) => audience.name)
    .join(", ");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const msg: string = e.currentTarget.message.value as string;

    newChatMessage.mutate({
      content: msg,
      threadId,
    });

    e.currentTarget.reset();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();

      const msg: string = e.currentTarget.value;

      newChatMessage.mutate({
        content: msg,
        threadId,
      });

      e.currentTarget.value = "";
    }
  };

  return (
    <>
      <div className="mx-auto grid max-h-fit min-h-lg max-w-2xl grid-flow-row gap-y-6 rounded-sm bg-white px-8 py-8 shadow">
        <div id="chat-header" className="row-span-1">
          <p className="mb-4 font-medium ">{audienceListString}</p>

          <hr />
        </div>

        <div
          id="chat-messages"
          ref={messagesContainer}
          className="flex max-h-md flex-col gap-y-4 overflow-y-scroll"
        >
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message.content}
              sender={message.sender.name}
              isSelf={message.senderId === session?.user.id}
              isOneAudience={thread.audienceList.length === 2}
            />
          ))}
        </div>

        <form
          id="chat-input"
          className="row-span-1 flex items-center"
          onSubmit={handleSendMessage}
        >
          <textarea
            id="message"
            name="message"
            className="relative w-full rounded-md border border-gray-300 px-6 py-2 outline-none focus:border-codemart-300"
            placeholder="Write your message..."
            onKeyUp={handleKeyUp}
          />
        </form>
      </div>
    </>
  );
};

ChatThreadPage.getInitialProps = ({ query }) => {
  return {
    threadId: query.id as string,
  };
};

export default ChatThreadPage;
