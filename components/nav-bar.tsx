"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrainCircuit, LogOut, User, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";

export function NavBar() {
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="border-b  w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section - Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6" />
            <span className="font-bold text-xl">EduSolve</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {!user && (
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
            <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Popover.Trigger asChild>
                <Button variant="ghost" size="icon">
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </Popover.Trigger>
              <Popover.Content
                className="w-48 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700"
                align="end"
                sideOffset={8}
              >
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    {user.role === "student" ? (
                      <>
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full">Dashboard</Button>
                        </Link>
                        <Link href="/ask">
                          <Button variant="ghost" className="w-full">Ask Doubt</Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/teacher">
                        <Button variant="ghost" className="w-full">Teacher Dashboard</Button>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <Button variant="ghost" onClick={handleLogout} className="w-full text-red-500">
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button variant="default" className="w-full">Login</Button>
                  </Link>
                )}
              </Popover.Content>
            </Popover.Root>
          </div>

          {/* Right Section - Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "student" ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/ask">
                      <Button variant="ghost">Ask Doubt</Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/teacher">
                    <Button variant="ghost">Teacher Dashboard</Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className="w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 border dark:border-gray-700"
                    align="end"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <DropdownMenu.Item asChild>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full text-red-500"
                      >
                        <LogOut className="h-5 w-5 mr-2" /> Logout
                      </Button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
