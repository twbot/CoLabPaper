// src/app/api/v1/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { prompt, context } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Here you would integrate with your preferred AI service
        // For example, OpenAI's API
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://api.openai.com/v1';
        const AI_SERVICE_KEY = process.env.AI_SERVICE_KEY;

        const aiResponse = await fetch(`${AI_SERVICE_URL}/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_SERVICE_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                prompt: `Generate LaTeX content for the following request: ${prompt}\nContext: ${context || 'None'}`,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });

        if (!aiResponse.ok) {
            throw new Error('Failed to generate content');
        }

        const data = await aiResponse.json();
        return NextResponse.json({
            content: data.choices[0].text.trim(),
        });

    } catch (error) {
        console.error('Error in AI generation:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}