// "use client";

// import { Loader, LogOut } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useCurrentUser } from "../api/use-current-user";
// import { useAuthActions } from "@convex-dev/auth/react";

// export const UserButton = () => {
//   const { signOut } = useAuthActions();
//   const { data, isLoading } = useCurrentUser();
//   if (isLoading) {
//     return <Loader className="size-4 animate-spin text-muted-foreground" />;
//   }
//   if (!data) {
//     return null;
//   }
//   const { image, name } = data;
//   const avatarFallback = name!.charAt(0).toUpperCase();

//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger className="outline-none relative">
//         <Avatar className="size-10 hover:opacity-75 transition">
//           <AvatarImage alt={name} src={image} />
//           <AvatarFallback className="bg-red-500 text-white">
//             {avatarFallback}
//           </AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="center" side="right" className="w-60">
//         <DropdownMenuItem onClick={() => signOut()} className="h-10">
//           <LogOut className="size-4 mr-2" />
//           Logout
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

"use client";

import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  // Handle sign out with error logging
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!data) {
    return null;
  }
  const { image, name } = data;
  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage className="rounded-md" alt={name} src={image} />
          <AvatarFallback className="rounded-md bg-red-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={handleSignOut} className="h-10">
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
