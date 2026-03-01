"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/app" className="flex items-center gap-2 font-semibold text-gray-900">
          <Flame className="w-5 h-5 text-orange-500" />
          Strava for Life
        </Link>

        <nav className="flex items-center gap-4">
          {/* Desktop nav links — hidden on mobile */}
          <Link href="/app" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/app/goals/new" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            New Goal
          </Link>
          <Link href="/app/squads" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Squads
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback>
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {/* Mobile nav links — shown only in dropdown on small screens */}
                <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
                  <Link href="/app">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
                  <Link href="/app/goals/new">New Goal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
                  <Link href="/app/squads">Squads</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
