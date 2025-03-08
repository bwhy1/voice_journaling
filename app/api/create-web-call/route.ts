import { NextResponse } from 'next/server';

// Server-side API endpoint for registering web calls
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_id, metadata } = body;

    if (!agent_id) {
      return NextResponse.json({ error: 'Missing agent_id parameter' }, { status: 400 });
    }

    // Get the Retell API key from environment variables
    const retellApiKey = process.env.RETELL_API_KEY;

    if (!retellApiKey) {
      console.error('RETELL_API_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      console.log('Making API call to Retell with agent_id:', agent_id);

      // Correct endpoint URL according to documentation
      // https://docs.retellai.com/api-references/create-web-call
      const retellResponse = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${retellApiKey}`,
        },
        body: JSON.stringify({
          agent_id,
          retell_llm_dynamic_variables: {
            first_name: 'Mohamed',
          },
          metadata: metadata || {},
        }),
      });

      if (!retellResponse.ok) {
        const errorText = await retellResponse.text();
        console.error('Retell API error response:', {
          status: retellResponse.status,
          statusText: retellResponse.statusText,
          body: errorText,
        });

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Ignore parse error, just use a default message
          errorData = { message: 'Invalid response from Retell API' };
        }

        return NextResponse.json(
          { error: 'Failed to register call with Retell', details: errorData },
          { status: retellResponse.status }
        );
      }

      // Return the successful response to the client
      const data = await retellResponse.json();
      return NextResponse.json(data);
    } catch (error: unknown) {
      console.error('Retell API error:', error);
      return NextResponse.json(
        {
          error: 'Failed to communicate with Retell API',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
