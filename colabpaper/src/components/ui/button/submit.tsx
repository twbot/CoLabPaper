"use client"

import { useFormStatus } from "react-dom"
import { type ComponentProps } from "react"
import { Button } from "@/components/ui/button/index"

type Props = ComponentProps<typeof Button> & {
    pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
    const { pending, action } = useFormStatus()

    const isPending = pending && action === props.formAction

    return (
        <Button {...props} type="submit" disabled={isPending}>
            {isPending ? pendingText : children}
        </Button>
    )
}