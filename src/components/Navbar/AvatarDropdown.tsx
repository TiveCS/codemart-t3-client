import { signOut, useSession } from "next-auth/react";
import { Button } from "../Button";

import {
  ArrowLeftOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const AvatarDropdown: React.FC = () => {
  const { data: session, status } = useSession();

  if (!session || status !== "authenticated") {
    return <></>;
  }

  return (
    <div className="absolute top-20 right-16 flex w-2/12 flex-col gap-y-2 border bg-white py-2 shadow-md">
      <Link href={"/users/[id]"} as={`/users/${session?.user.id}`}>
        <Button
          className="inline-flex gap-x-4 text-left hover:text-codemart-600"
          style="text"
        >
          <UserIcon className="h-6 w-6 " /> Profile
        </Button>
      </Link>

      <Button
        className="inline-flex gap-x-4 text-left hover:text-red-600"
        style="text"
        onClick={() => signOut()}
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 " /> Logout
      </Button>
    </div>
  );
};

export default AvatarDropdown;
