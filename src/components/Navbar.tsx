import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  return (
    <>
      <nav className="bg-white text-gray-800 p-4 px-8 flex justify-between items-center border border-b-gray-300 dark:border-b-slate-700 dark:bg-slate-900 dark:text-gray-500 dark:hover:text-gray-300">
        <div className="text-2xl font-semibold">
          <Link href="#home">Acme Co</Link>
        </div>
        <ul className="hidden md:flex space-x-4 font-normal">
          <li>
            <Link
              href="#home"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#book"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Book
            </Link>
          </li>
          <li>
            <Link
              href="#quest"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Quest
            </Link>
          </li>
          <li>
            <Link
              href="#event"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Event
            </Link>
          </li>
          <li>
            <Link
              href="#services"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Services
            </Link>
          </li>
          <li>
            <Link
              href="#support"
              className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-500 transition dark:text-gray-500 dark:hover:text-gray-300">
              Support
            </Link>
          </li>
          <UserAvatar />
        </ul>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="text-gray-100 dark:text-gray-800">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-800">
              <DropdownMenuItem>
                <Link href="#home">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#book">Book</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#quest">Quest</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#event">Event</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#services">Services</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#support">Support</Link>
              </DropdownMenuItem>
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;
