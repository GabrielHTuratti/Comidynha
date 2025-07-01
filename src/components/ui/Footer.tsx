"use client";

import { Utensils, Link } from "lucide-react"


export default function Footer(){

    return (      
        <footer className="border-t bg-[#F36280] text-white">
            <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
            <div className="flex items-center pl-4 gap-4">
            <Utensils className="h-6 w-6 text-emerald-500" />
                <span className="text-lg font-semibold">Comydinha</span>
            </div>
            <div className="flex items-center gap-2">
                © 2025 Comydinha. All rights reserved.
            </div>
            </div>
        </footer>
    )
}

