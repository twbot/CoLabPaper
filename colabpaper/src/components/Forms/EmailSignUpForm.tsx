'use client'
import React, { useMemo, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SubmitButton } from '@/components/ui/button/submit'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { EmailAndProfileSignUpSchema } from '@/types'
import { redirect } from 'next/navigation'
import { getSVGFromName } from '@/components/Icons'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwindconfig'

const fullConfig = resolveConfig(tailwindConfig)

interface EmailSignUpFormProps {
    action: (values: z.infer<typeof EmailAndProfileSignUpSchema>) => Promise<never>
    formHeaderMessage: string
    formButtonMessage: string
}

const EmailSignUpForm = (props: EmailSignUpFormProps) => {

    // state
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
            //TODO: Handle any error scenario
        }
    }

    console.log(fullConfig.theme)
    console.log(fullConfig.darkMode)
    // SVGs
    const eyeSVG = useMemo(() => {
        return getSVGFromName('Eye', { "aria-label": 'View Password', fillcolor: '#000' })
    }, [])
    const hideEyeSVG = useMemo(() => {
        return getSVGFromName('HideEye', { "aria-label": 'Hide Password', fillcolor: '#000' })
    }, [])

    return (
        <div className="w-full flex flex-col justify-center items-center align-middle gap-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 md:w-1/2 animate-in flex flex-col justify-center items-center gap-2 text-foreground">
                    <div className="flex flex-col justify-center items-center mb-2 mt-8">
                        <span className="text-primary font-extrabold text-2xl lg:text-3xl">{props.formHeaderMessage}</span>
                    </div>
                    <div className='w-full'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
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
                                            <Input placeholder="First Name" {...field} />
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
                                            <Input placeholder="Last Name" {...field} />
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
                                        <Input placeholder="Username" {...field} />
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
                                                {...field}
                                            />
                                            <div
                                                className='flex flex-row justify-center align-middle items-center w-[30px] h-[30px] cursor-pointer px-[2px]'
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
                    {/* TODO: Update button color when color scheme is finalized */}
                    <SubmitButton
                        className="bg-slate-700 rounded-md px-4 py-2 text-primary-foreground mb-2 text-md hover:bg-accent/80 w-full"
                    >
                        {props.formButtonMessage}
                    </SubmitButton>
                </form>
            </Form>
        </div>
    )
}

export default EmailSignUpForm