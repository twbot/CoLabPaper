import React, { useMemo } from 'react'
import Image from 'next/image'
import { getSVGFromName } from '@/components/Icons'

const Navbar = () => {

    // SVG's
    const accountSVG = useMemo(() => {
        return getSVGFromName('Account', { "aria-label": 'account', fillcolor: '#fff' })
    }, [])

    return (
        <div className="sticky top-0 bg-primary neumorphic-border flex flex-row items-center justify-start h-[100px] max-h-[100px]">
            <div className="m-2 flex-1">
                <div className="flex flex-row normal-case text-xl text-white p-1 h-auto">
                    <Image
                        src="/CoLabPaper.svg"
                        width={40}
                        height={40}
                        alt="Search Icon"
                    />
                    <div className='ml-2 flex flex-row justify-center items-center'>
                        <span>CoLabPaper</span>
                    </div>
                </div>
            </div>
            <div className="m-2 flex-none">
                <div className="dropdown dropdown-end">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-10 rounded-full">
                            {accountSVG}
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 hidden"
                    >
                        <li>
                            <a className="justify-between">
                                Profile
                                {/* <span className="badge">New</span> */}
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
