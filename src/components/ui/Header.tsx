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
        console.log(error);
        setName(null);
      }
    };
    getUser();
  }, []);

  const toggleProfileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
  <header className="border-b bg-[#F36280] text-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity">
          <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
          <span>Comydinha</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {name ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div className="rounded-sm bg-white flex items-center gap-2 sm:gap-4 cursor-pointer focus:outline-none hover:bg-gray-100 transition-colors">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="p-0.5 w-8 h-8 sm:w-9 sm:h-9 focus:outline-none"
                    onClick={toggleProfileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#06d6a0"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-7 w-7 sm:h-9 sm:w-9"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 sm:w-60 p-2" align="end" forceMount>
                <div className="px-2 py-1.5">
                  <span className="text-sm sm:text-base font-medium">{name}</span>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/main" className="w-full px-2 py-1.5 text-sm sm:text-base">
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="w-full px-2 py-1.5 text-sm sm:text-base">
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Button
                    size="sm"
                    onClick={async () => {
                      setName(null)
                      await logout()
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                  >
                    Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link 
                href="/auth/customer" 
                className="text-xs sm:text-sm font-medium hover:underline underline-offset-4 hidden xs:inline-block"
              >
                Cadastrar
              </Link>
              <Button asChild size="sm" className="bg-[#F9C900] hover:bg-[#e0b500] text-xs sm:text-sm">
                <Link href="/auth/customer">Logar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}