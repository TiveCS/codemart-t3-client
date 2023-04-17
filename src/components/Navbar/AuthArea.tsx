import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AvatarDropdown from "./AvatarDropdown";

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

      <div
        className="hidden cursor-pointer gap-x-4 lg:flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        {status === "authenticated" && (
          <>
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
