import { signOut } from "next-auth/react";
import { Button } from "../Button";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

const AvatarDropdown: React.FC = () => {
  return (
    <div className="absolute top-20 right-16 w-2/12 border bg-white shadow-md">
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
