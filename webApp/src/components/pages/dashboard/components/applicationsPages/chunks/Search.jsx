
import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch?.(searchTerm.trim());
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex w-full items-center gap-2"
        >
            {/* Search Input */}
            <div className=" flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 transition-all focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/10">

                <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">
                    search
                </span>

                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search applications..."
                    className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />

            </div>

            {/* Search Button */}
            <button
                type="submit"
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 active:bg-teal-900"
            >
                <span className="material-symbols-outlined text-base">
                    search
                </span>

                Search
            </button>

        </form>
    );
};

export default Search;
