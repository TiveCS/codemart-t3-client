import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const AuthArea: React.FC = () => {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row items-center justify-end">
      {status === "unauthenticated" && (
        <>
          <Link href={"/auth"}>
            <Button style={"primary"}>Join Now</Button>
          </Link>
        </>
      )}

      <div className="hidden items-center gap-x-4 lg:flex">
        {status === "authenticated" && (
          <>
            <Link
              href={"/users/[id]/chat"}
              as={`/users/${session.user.id}/chat`}
              className="cursor-pointer"
            >
              <EnvelopeIcon className="mr-6 h-6 w-6 text-gray-900" />

              {/* TODO: Check if user is authed and there are unread messages */}

              {/* {true && (
                <span className="absolute z-10 flex h-4 w-4 translate-x-4 -translate-y-2.5 items-center justify-center rounded-full bg-red-600 text-sm text-white">
                  3
                </span>
              )} */}
            </Link>

            <div
              className="flex cursor-pointer gap-x-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <p
                id="user-name"
                className="hidden items-center font-medium md:flex"
              >
                {session.user.name}
              </p>

              {session.user.image && (
                <Image
                  id="user-avatar"
                  src={session.user.image}
                  alt={""}
                  width={48}
                  height={48}
                  className="h-10 w-10 rounded-full md:max-w-fit"
                />
              )}

              {isOpen && <AvatarDropdown />}
            </div>
          </>
        )}
      </div>

      {status === "authenticated" && (
        <Bars3Icon className="h-6 w-6 text-gray-500 lg:hidden" />
      )}
    </div>
  );
};

export default AuthArea;
