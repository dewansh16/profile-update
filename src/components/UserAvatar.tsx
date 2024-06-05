"use client";

import { FC } from "react";
import { useUser } from "@/context/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface UserAvatarProps {}

const UserAvatar: FC<UserAvatarProps> = ({}) => {
  const { user } = useUser();
  if (user) {
    return (
      <li className="flex w-full items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={user.profilePhoto}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-gray-800">
            <DropdownMenuItem>
              <Link href="#profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#logout">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    );
  }
  return (
    <li className="flex w-full items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white text-gray-800">
          <DropdownMenuItem>
            <Link href="#profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#logout">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

export default UserAvatar;
