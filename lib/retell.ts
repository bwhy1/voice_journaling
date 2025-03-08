import { RetellWebClient } from 'retell-client-js-sdk';
import Retell from 'retell-sdk';


// Retell agent IDs
export const SETUP_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_SETUP_AGENT_ID || '';
export const JOURNAL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_JOURNAL_AGENT_ID || '';
export const RETELL_API_KEY = process.env.NEXT_PUBLIC_RETELL_API_KEY || '';

// Create a singleton instance of RetellWebClient
export const retellWebClient = new RetellWebClient();

// Define types for Retell API interactions
export interface RetellCallResponse {
  access_token: string;
  call_id?: string;
}

export interface RetellUpdate {
  transcript?: string;
  [key: string]: unknown;
}

export interface RetellMetadata {
  [key: string]: unknown;
}

const client = new Retell({
  apiKey: 'YOUR_RETELL_API_KEY',
});

// Register a call with Retell API via our server endpoint
export async function registerCall(
  agentId: string,
  userProfile?: RetellMetadata
): Promise<RetellCallResponse> {
  try {
    // Call our server endpoint which uses the Retell API
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RETELL_API_KEY,
      },
      body: JSON.stringify({
        agent_id: agentId,
        metadata: userProfile,
        retell_llm_dynamic_variables: {
          user_summary: 'Lutfi is a 30-year-old software engineer living in Berlin who is interested in sports, project work, and personal well-being.',
          user_goals_focus: 'Lutfi aims to track his sports activities, daily projects, meals, and mood to understand their correlations.',
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error registering Retell call:', err);
    throw err;
  }
}

// Initialize Retell client with event handlers
export function initializeRetellClient(
  onCallStarted?: () => void,
  onCallEnded?: () => void,
  onAgentStartTalking?: () => void,
  onAgentStopTalking?: () => void,
  onUpdate?: (update: RetellUpdate) => void,
  onError?: (error: Error) => void
) {
  // Call started event
  retellWebClient.on('call_started', () => {
    console.log('Retell call started');
    if (onCallStarted) onCallStarted();
  });

  // Call ended event
  retellWebClient.on('call_ended', () => {
    console.log('Retell call ended');
    if (onCallEnded) onCallEnded();
  });

  // Agent talking events (for UI animations)
  retellWebClient.on('agent_start_talking', () => {
    console.log('Agent started talking');
    if (onAgentStartTalking) onAgentStartTalking();
  });

  retellWebClient.on('agent_stop_talking', () => {
    console.log('Agent stopped talking');
    if (onAgentStopTalking) onAgentStopTalking();
  });

  // Updates (including transcripts)
  retellWebClient.on('update', (update) => {
    console.log('Retell update:', update);
    if (onUpdate) onUpdate(update as RetellUpdate);
  });

  // Error handling
  retellWebClient.on('error', (error) => {
    console.error('Retell error:', error);
    if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    // Stop the call on error
    retellWebClient.stopCall();
  });
}

// Start a call with Retell
export async function startRetellCall(agentId: string, metadata?: RetellMetadata) {
  try {
    const response = await registerCall(agentId, metadata);
    const { access_token, call_id } = response;

    await retellWebClient.startCall({
      accessToken: access_token,
    });

    return { success: true, call_id };
  } catch (error) {
    console.error('Failed to start Retell call:', error);
    return { success: false, call_id: null };
  }
}

// Stop an ongoing Retell call
export function stopRetellCall() {
  retellWebClient.stopCall();
}
