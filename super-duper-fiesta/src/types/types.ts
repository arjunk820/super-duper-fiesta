// All types needed defined here

// CampaignBrief : description, event, city, venue_name, time, tickets/space available
// venue_name, city, and space are optional fields which can be added if the user is interested
export interface CampaignBrief {
    desc: string;
    event: string;
    city ?: string;
    venue_name ?: string;
    time : Date;
    capacity ?: number;
}

export const status = {
    success: 0,
    failure: 1
} as const;

export type Status = (typeof status)[keyof typeof status];

// AgentResponse : {status: success} / {status: failure}, status of marketing campaign initiated for the brief.
// AgentResponse should also have campaign_id (if successful) and generated_summary as well
export type AgentResponse = SuccessfulAgentResponse | FailedAgentResponse;

export interface SuccessfulAgentResponse {
    status: typeof status.success;
    campaign_id: string;
    generated_summary: string;
}

export interface FailedAgentResponse {
    status: typeof status.failure; // using typeof to specify success/failure
}

export type FormStatus = 'idle' | 'processing' | 'complete' | 'error';