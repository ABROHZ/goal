"use client";
import { useState, useEffect } from "react";
import { UserCircle, Settings, LogOut, Award, Target } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Get additional user data from the users table
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser({
          ...user,
          profile: data || {},
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {loading ? (
            <UserCircle className="h-8 w-8" />
          ) : (
            <Avatar>
              <AvatarImage
                src={user?.profile?.avatar_url || user?.profile?.image}
                alt={user?.profile?.name || user?.email}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.profile?.name || user?.email || "")}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.profile?.name || user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <Target className="mr-2 h-4 w-4" />
              My Goals
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
