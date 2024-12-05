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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail } from "lucide-react"

interface SignUpClientProps {
    searchParams: { status?: string; email?: string; memoryID?: string; message?: string }
    signUp: (values: z.infer<typeof EmailAndProfileSignUpSchema>) => Promise<never>
}

export default function SignUpClient({ searchParams, signUp }: SignUpClientProps) {
    const getEmailClient = (email: string): { clientURI: string; clientName: string; clientIconPath: string } | null => {
        const emailDomain = email.split('@')[1]

        const emailClients = {
            'gmail.com': {
                clientURI: 'https://mail.google.com',
                clientName: 'Gmail',
                clientIconPath: '/icons/email-clients/gmail.png'
            },
            'outlook.com': {
                clientURI: 'https://outlook.live.com',
                clientName: 'Outlook',
                clientIconPath: '/icons/email-clients/outlook.png'
            },
            'hotmail.com': {
                clientURI: 'https://outlook.live.com',
                clientName: 'Outlook',
                clientIconPath: '/icons/email-clients/outlook.png'
            },
            'live.com': {
                clientURI: 'https://outlook.live.com',
                clientName: 'Outlook',
                clientIconPath: '/icons/email-clients/outlook.png'
            },
            'yahoo.com': {
                clientURI: 'https://mail.yahoo.com',
                clientName: 'Yahoo Mail',
                clientIconPath: '/icons/email-clients/yahoomail.png'
            },
            'icloud.com': {
                clientURI: 'https://www.icloud.com/mail',
                clientName: 'iCloud',
                clientIconPath: '/icons/email-clients/icloud.png'
            },
            'protonmail.com': {
                clientURI: 'https://mail.protonmail.com',
                clientName: 'ProtonMail',
                clientIconPath: '/icons/email-clients/protonmail.png'
            }
        }

        return emailClients[emailDomain as keyof typeof emailClients] || null
    }

    const emailClientData = searchParams.email ? getEmailClient(decodeURIComponent(searchParams.email)) : undefined
    const isConfirmEmail = searchParams.status === SIGNUP_RETURN_TYPES.CONFIRM_EMAIL && searchParams.email
    const isAlreadyRegistered = searchParams.status === SIGNUP_RETURN_TYPES.ALREAD_REGISTERED_ERROR

    return (
        <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-[600px] space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src={'/CoLabPaper.svg'}
                        width={80}
                        height={80}
                        alt="CoLabPaper Icon"
                        className="transition-transform hover:scale-105"
                    />
                </div>

                {isConfirmEmail ? (
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
                            <p className="text-muted-foreground">
                                We sent an email to <span className="font-medium text-foreground">{decodeURIComponent(searchParams.email!)}</span>
                            </p>
                            <p className="text-muted-foreground">Click the link inside to get started.</p>
                        </div>

                        {emailClientData && (
                            <Button
                                className="w-full sm:w-auto"
                                size="lg"
                                onClick={() => window.open(emailClientData.clientURI, '_blank')}
                            >
                                {/* <Mail className="mr-2 h-4 w-4" /> */}
                                <Image src={emailClientData.clientIconPath} alt={emailClientData.clientName + 'Icon'} width={20} height={20} className="mr-2" />
                                Open {emailClientData.clientName}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <EmailSignUpForm
                                action={signUp}
                                formHeaderMessage="Create an account"
                                formButtonMessage="Sign Up"
                            />

                            {isAlreadyRegistered && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        This email is already registered. Please sign in or use a different email.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-sm">
                                <span className="text-muted-foreground">Already have an account?</span>
                                <Link
                                    href={searchParams.memoryID ? `/signin?memoryID=${searchParams.memoryID}` : '/signin'}
                                    className="ml-2 text-primary hover:text-primary/80 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-background px-2 text-muted-foreground text-sm">
                                        OR
                                    </span>
                                </div>
                            </div>

                            <GoogleAuthButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}