'use client'
import React, { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { Input } from './input';

interface SearchProps {
    searchText: string
    onSearchChange: (value: string) => void;
}

const Search = (props: SearchProps) => {
    return (
        <div className="input input-md container-inset-sm input-bordered w-auto max-w-xs h-10 ">
            <div
                className="flex flex-row h-full border border-solid border-zinc-400 rounded-sm focus-within:ring-2 focus-within:ring-blue-500"
                tabIndex={0}
            >
                <Image
                    src="/search.svg"
                    width={18}
                    height={18}
                    alt="Search Icon"
                    className="mx-2"
                />
                <input
                    type="text"
                    placeholder="Search Projects"
                    className="w-full bg-transparent focus:outline-none"
                    value={props.searchText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Search;