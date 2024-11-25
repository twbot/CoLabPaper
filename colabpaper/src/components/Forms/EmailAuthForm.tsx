'use client'
import React, { useState, useMemo } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SubmitButton } from '@/components/ui/button/submit'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '../ui/input'
import { EmailSignInFormSchema } from '@/types'
import { getSVGFromName } from '@/components/Icons'

interface EmailAuthFormProps {
    action: (values: z.infer<typeof EmailSignInFormSchema>) => Promise<never>
    formHeaderMessage: string
    formButtonMessage: string
}

const EmailAuthForm = (props: EmailAuthFormProps) => {

    // state
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const form = useForm<z.infer<typeof EmailSignInFormSchema>>({
        resolver: zodResolver(EmailSignInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const onSubmit = async (values: z.infer<typeof EmailSignInFormSchema>) => {
        try {
            await props.action(values)
        } catch (error) {
            console.error("Error signing up:", error)
            //TODO: Handle any error scenario
        }
    }

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
                        <span className="text-primary font-extrabold text-3xl">{props.formHeaderMessage}</span>
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

export default EmailAuthForm