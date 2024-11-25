import { createClient } from "@/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Profile, TempProfile } from "@/types/database.types"
import { ProfilePOSTSchema } from "@/types/api/profile.types"
import { TABLE } from "@/constants/database"
import { TempProfilePOSTSchema } from "@/types/api/temp-profile.types"

export async function GET(request: NextRequest) {
  const supabase = createClient()

  try {

    const { data: { user } } = await supabase.auth.getUser()

    // Get the temp_profile data
    const { data, error } = await supabase
      .from(TABLE.TEMP_PROFILE)
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }

   // Validate the data against the TempProfile schema
   const validatedData = TempProfile.parse(data)

   // Return the validated temp_profile data as the API response
   return NextResponse.json({ data: validatedData }, { status: 200 })
  } catch (error) {
    // Handle any other errors that occurred during the API request
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {

    // Parse the request body
    const body = await request.json()

    // Validate the request body against the ProfileSetupFormSchema
    const { user_id, first_name, last_name, username, email } = TempProfilePOSTSchema.parse(body)
    
    // Insert the temp_profile data into the 'temp_profile' table and select the inserted row
    const { data, error } = await supabase
      .from(TABLE.TEMP_PROFILE)
      .insert([{ user_id, first_name, last_name, username, email }])
      .select()
      .single()

    if (error) {
      // Handle any errors that occurred during the insertion
      console.error("Error inserting temp_profile:", error)
      return NextResponse.json({ error: "Failed to insert temp_profile" }, { status: 500 })
    }

    // Return the inserted temp_profile data as the API response
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

export async function DELETE(request: NextRequest) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error: deleteError } = await supabase
      .from(TABLE.TEMP_PROFILE)
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting temp profile:', deleteError)
      return NextResponse.json({ error: 'Failed to delete temp profile' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Temp profile deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in delete temp profile process:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}