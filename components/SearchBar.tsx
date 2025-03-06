"use client";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    return (
        <div className="mb-4 flex items-center gap-2">
            <input
                type="text"
                placeholder="Search doubts..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value);
                }}
                className="border p-2 rounded-md w-full"
            />
        </div>
    );
}
