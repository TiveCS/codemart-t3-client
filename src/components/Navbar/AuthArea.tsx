import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Bars3Icon } from "@heroicons/react/24/outline";

const AuthArea: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-row items-center justify-end">
      {status !== "authenticated" && (
        <>
          <Link href={"/auth"}>
            <Button style={"primary"}>Join Now</Button>
          </Link>
        </>
      )}

      <div className="hidden gap-x-4 md:flex">
        {status === "authenticated" && (
          <>
            <p className="hidden items-center font-medium md:flex">
              {session.user.name}
            </p>

            {session.user.image && (
              <Image
                src={session.user.image}
                alt={""}
                width={48}
                height={48}
                className="h-10 w-10 rounded-full md:max-w-fit"
              />
            )}
          </>
        )}
      </div>

      <Bars3Icon className="h-6 w-6 text-gray-500 md:hidden" />
    </div>
  );
};

export default AuthArea;
