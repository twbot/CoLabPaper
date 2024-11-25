import { createClient } from "@/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Profile } from "@/types/database.types"
import { ProfilePOSTSchema } from "@/types/api/profile.types"
import { TABLE } from "@/constants/database"

export async function GET(request: NextRequest) {
  const supabase = createClient()

  try {

    const { data: { user } } = await supabase.auth.getUser()

    // Get the profile data
    const { data, error } = await supabase
      .from(TABLE.PROFILE)
      .select('*')
      .eq('id', user.id)
      .single()
      .returns<z.infer<typeof Profile>>()

    if (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }

    // Return the profile data as the API response
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    // Handle any other errors that occurred during the API request
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    // Parse the request body
    const body = await request.json()

    // Validate the request body against the ProfileSetupFormSchema
    const { first_name, last_name, username, email } = ProfilePOSTSchema.parse(body)
    
    // Insert the profile data into the 'profile' table and select the inserted row
    const { data, error } = await supabase
      .from(TABLE.PROFILE)
      .insert([{ id: user.id, first_name, last_name, username, email }])
      .select()
      .single()
      .returns<z.infer<typeof Profile>>()

    if (error) {
      // Handle any errors that occurred during the insertion
      console.error("Error inserting profile:", error)
      return NextResponse.json({ error: "Failed to insert profile" }, { status: 500 })
    }

    // Return the inserted profile data as the API response
    return NextResponse.json({ profile: data }, { status: 201 })
  } catch (error) {
    // Handle any validation errors
    if (error instanceof z.ZodError) {
        // Type the error as z.ZodError before accessing its issues property
        const zodError: z.ZodError = error
        return NextResponse.json({ error: zodError.issues }, { status: 400 })
      }

    // Handle any other errors that occurred during the API request
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}