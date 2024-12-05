// src/components/Forms/EmailSignUpForm.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SubmitButton } from '@/components/ui/button/submit'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { EmailAndProfileSignUpSchema } from '@/types'
import { getSVGFromName } from '@/components/Icons'

interface EmailSignUpFormProps {
    action: (values: z.infer<typeof EmailAndProfileSignUpSchema>) => Promise<never>
    formHeaderMessage: string
    formButtonMessage: string
}

const EmailSignUpForm = (props: EmailSignUpFormProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const form = useForm<z.infer<typeof EmailAndProfileSignUpSchema>>({
        resolver: zodResolver(EmailAndProfileSignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            username: ""
        },
    })

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const onSubmit = async (values: z.infer<typeof EmailAndProfileSignUpSchema>) => {
        try {
            await props.action(values)
        } catch (error) {
            console.error("Error signing up:", error)
        }
    }

    const eyeSVG = useMemo(() => {
        return getSVGFromName('Eye', { "aria-label": 'View Password', fillcolor: 'currentColor' })
    }, [])

    const hideEyeSVG = useMemo(() => {
        return getSVGFromName('HideEye', { "aria-label": 'Hide Password', fillcolor: 'currentColor' })
    }, [])

    return (
        <div className="w-full flex flex-col justify-center items-center align-middle gap-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 md:w-1/2 animate-in flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-col justify-center items-center mb-2 mt-8">
                        <span className="text-foreground font-extrabold text-2xl lg:text-3xl">
                            {props.formHeaderMessage}
                        </span>
                    </div>
                    <div className='w-full'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            className="bg-background border-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-full flex flex-row gap-1'>
                        <div className='w-1/2'>
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="First Name"
                                                className="bg-background border-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='w-1/2'>
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Last Name"
                                                className="bg-background border-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            className="bg-background border-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-full'>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-row justify-center align-middle items-center">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="bg-background border-input"
                                                {...field}
                                            />
                                            <div
                                                className='flex flex-row justify-center align-middle items-center w-[30px] h-[30px] cursor-pointer px-[2px] text-muted-foreground hover:text-foreground transition-colors'
                                                onClick={toggleShowPassword}
                                            >
                                                {showPassword ? eyeSVG : hideEyeSVG}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <SubmitButton
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 mb-2 text-md w-full"
                    >
                        {props.formButtonMessage}
                    </SubmitButton>
                </form>
            </Form>
        </div>
    )
}

export default EmailSignUpForm