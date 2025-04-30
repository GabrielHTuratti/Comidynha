"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, logout } from "@/services/v1";
import { IUser } from "@/model/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Header() {
  const [name, setName] = useState<IUser["name"] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const profile = await getProfile();
        setName(profile.name);
      } catch (error) {
        setName(null);
      }
    };
    getUser();
  }, []);

  const toggleProfileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-[#F36280] text-white">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Utensils className="h-6 w-6 text-emerald-500" />
          <span>Comydinha</span>
        </Link>
        <div className="flex items-center gap-4">
          {name ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
              <div className=" rounded-sm bg-white flex items-center gap-4 cursor-pointer focus:outline-none">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="p-1 w-9 h-9 focus:outline-none "
                    onClick={toggleProfileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="#06d6a0"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-9 w-9"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 h-45 p-2" align="end" forceMount>
              <span className="text-l2 font-medium md:inline-block pl-1">{name}</span>
                <DropdownMenuItem asChild>
                  <Link href="/main">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                  size="sm"
                  onClick={async () => {
                    setName(null)
                    await logout()
                  }}
                  className="bg-red-500 rounded-sm hover:bg-red-700 ">
                  Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/customer" className="text-sm font-medium hover:underline underline-offset-4">
                Cadastrar
              </Link>
              <Button asChild className="bg-[#F9C900]">
                <Link href="/auth/customer">Logar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}