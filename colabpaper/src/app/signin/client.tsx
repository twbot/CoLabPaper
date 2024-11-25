'use client'

import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import GoogleAuthButton from "@/components/ui/button/google-auth"
import EmailAuthForm from '@/components/Forms/EmailAuthForm'
import { EmailSignInFormSchema } from "@/types"
import { z } from "zod"
import { SIGNIN_RETURN_TYPES } from "@/constants"

interface SignInClientProps {
    searchParams: { status: string; memoryID?: string }
    signIn: (values: z.infer<typeof EmailSignInFormSchema>) => Promise<never>
}

export default function SignInClient({ searchParams, signIn }: SignInClientProps) {
    return (
        <div className="h-screen flex flex-col justify-center items-center align-middle gap-2">
            <div className="w-full lg:w-3/4 xl:w-1/2 h-screen flex flex-col justify-center items-center align-middle">
                <div className="flex flex-row justify-center align-middle items-center">
                    <Image src={'/CoLabPaper.svg'} width={80} height={80} alt="rekall-logo" />
                </div>
                <EmailAuthForm
                    formHeaderMessage="Welcome back"
                    action={signIn}
                    formButtonMessage="Sign in"
                />
                {searchParams.status && searchParams.status === SIGNIN_RETURN_TYPES.INVALID_CREDENTIALS && (
                    <div className="w-3/4 md:w-1/2 mb-4">
                        <p className="text-red-500 text-sm text-left">Incorrect email or password</p>
                    </div>
                )}
                {searchParams.status && searchParams.status === SIGNIN_RETURN_TYPES.ERROR && (
                    <div className="w-3/4 md:w-1/2 mb-4">
                        <p className="text-red-500 text-sm text-left">Could not authenticate user</p>
                    </div>
                )}
                <div className="w-3/4 md:w-1/2 flex flex-row justify-center align-middle items-center my-2">
                    <div>
                        <span className="text-primary text-md">Don&#39;t have an account?</span>
                        <Link href={searchParams.memoryID ? `/signup?memoryID=${searchParams.memoryID}` : '/signup'} className="text-blue-500 text-sm px-2 cursor-pointer">
                            Sign Up
                        </Link>
                    </div>
                </div>
                <div className="w-3/4 md:w-1/2 flex flex-row justify-center align-middle items-center mb-4 mt-2">
                    <Separator className="w-1/3" />
                    <span className="w-1/3 text-center">OR</span>
                    <Separator className="w-1/3" />
                </div>
                <div className="w-3/4 md:w-1/2 flex flex-col justify-center align-middle items-center">
                    <GoogleAuthButton />
                </div>
            </div>
        </div>
    )
}