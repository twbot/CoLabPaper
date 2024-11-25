'use client'

import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import GoogleAuthButton from "@/components/ui/button/google-auth"
import { Button } from "@/components/ui/button/index"
import EmailSignUpForm from "@/components/Forms/EmailSignUpForm"
import { EmailAndProfileSignUpSchema } from "@/types"
import { SIGNUP_RETURN_TYPES } from "@/constants"
import { z } from "zod"

interface SignUpClientProps {
    searchParams: { status?: string; email?: string; memoryID?: string; message?: string }
    signUp: (values: z.infer<typeof EmailAndProfileSignUpSchema>) => Promise<never>
}

export default function SignUpClient({ searchParams, signUp }: SignUpClientProps) {
    const getEmailClient = (email: string): { clientURI: string; clientName: string; clientIconPath: string } | null => {
        const emailDomain = email.split('@')[1]

        let clientURI = null
        let clientName = null
        let clientIconPath = null
        switch (emailDomain) {
            case 'gmail.com':
                clientURI = 'https://mail.google.com'
                clientName = 'Gmail'
                clientIconPath = '/icons/email-clients/gmail.png'
                break
            case 'outlook.com':
            case 'hotmail.com':
            case 'live.com':
                clientURI = 'https://outlook.live.com'
                clientName = 'Outlook'
                clientIconPath = '/icons/email-clients/outlook.png'
                break
            case 'yahoo.com':
                clientURI = 'https://mail.yahoo.com'
                clientName = 'Yahoo Mail'
                clientIconPath = '/icons/email-clients/yahoomail.png'
                break
            case 'icloud.com':
                clientURI = 'https://www.icloud.com/mail'
                clientName = 'iCloud'
                clientIconPath = '/icons/email-clients/icloud.png'
                break
            case 'protonmail.com':
                clientURI = 'https://mail.protonmail.com'
                clientName = 'ProtonMail'
                clientIconPath = '/icons/email-clients/protonmail.png'
                break
            default:
                break
        }
        return (clientURI && clientName && clientIconPath) ? { clientURI, clientName, clientIconPath } : null
    }

    const emailClientData = searchParams.email ? getEmailClient(decodeURIComponent(searchParams.email)) : undefined

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center align-middle gap-2">
            {searchParams.status && searchParams.status === SIGNUP_RETURN_TYPES.CONFIRM_EMAIL && searchParams.email ? (
                <>
                    <div className="flex flex-row justify-center align-middle items-center">
                        <Image src={'/logo-bg-dark.svg'} width={80} height={80} alt="rekall-logo" />
                    </div>
                    <div className="w-full sm:w-3/4 flex flex-col justify-center items-center align-middle gap-2">
                        <div className="flex flex-col justify-center items-center mt-8">
                            <span className="text-primary font-extrabold text-3xl">Verify your email</span>
                        </div>
                        <div className="flex flex-col justify-center items-center mb-6 mt-2">
                            <span className="text-primary font-extrabold text-md">We sent an email to {decodeURIComponent(searchParams.email)}.</span>
                            <span className="text-primary font-extrabold text-md">Click the link inside to get started.</span>
                        </div>
                        {emailClientData && (
                            <Button className="w-1/2 flex flex-row justify-center align-middle items-center bg-primary">
                                <Image src={emailClientData.clientIconPath} alt="Email client icon" width={20} height={20} className="mr-2" />
                                <Link href={emailClientData.clientURI} rel="noopener noreferrer" target="_blank" className="text-lg">
                                    Open {emailClientData.clientName}
                                </Link>
                            </Button>
                        )}
                    </div>
                </>
            )
                : (
                    <div className="w-full lg:w-3/4 xl:w-1/2 h-screen flex flex-col justify-center items-center align-middle">
                        <div className="flex flex-row justify-center align-middle items-center">
                            <Image src={'/CoLabPaper.svg'} width={80} height={80} alt="rekall-logo" />
                        </div>
                        <EmailSignUpForm action={signUp} formHeaderMessage="Create an account" formButtonMessage="Sign Up" />
                        {searchParams.status && searchParams.status === SIGNUP_RETURN_TYPES.ALREAD_REGISTERED_ERROR && (
                            <div className="w-3/4 md:w-1/2 mb-4">
                                <p className="text-red-500 text-sm text-left">This email is already registered. Please sign in or use a different email.</p>
                            </div>
                        )}
                        <div className="w-3/4 md:w-1/2 flex flex-row justify-center align-middle items-center my-2">
                            <div>
                                <span className="text-primary text-md">Already have an account?</span>
                                <Link href={searchParams.memoryID ? `/signin?memoryID=${searchParams.memoryID}` : '/signin'} className="text-blue-500 text-sm px-2 cursor-pointer">
                                    Sign In
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
                )}
        </div>
    )
}