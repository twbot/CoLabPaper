'use client'
import React from 'react'
import { Button } from '@/components/ui/button/index'
import Image from 'next/image'

const GoogleAuthButton = () => {

    const signupWithGoogle = async () => {
        const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/social/google`, {
            method: 'POST',
        })

        if (!response.ok) {
            console.error('Error signing in with Google')
            // TODO: Handle error appropriately
            return
        }

        const data = await response.json()

        if (data.url) {
            window.location.href = data.url
        }
    }

    return (
        <Button
            onClick={signupWithGoogle}
            className="w-full bg-white rounded-md px-4 py-6 text-primary mb-2 border border-bg-gray-200 hover:bg-gray-200 hover:text-inherit flex flex-row justify-start align-middle items-center">
            <div className='mr-[15px]'>
                <Image src={'icons/social/google-logo.svg'} width={30} height={30} alt="google-logo" className="pr-2"></Image>
            </div>
            <span className='text-lg text-black'>Continue with Google</span>
        </Button>
    )
}

export default GoogleAuthButton