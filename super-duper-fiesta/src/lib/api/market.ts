// API call which takes in CampaignBrief and populates AgentResponse

import type { CampaignBrief, AgentResponse } from "../../types/types";
import { status } from "../../types/types";

// Mock function — simulates a slow API that returns a campaign response
export const returnAgent = (
    brief: CampaignBrief
): Promise<AgentResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // resolve is how you "return" from a Promise
            // whatever you pass to resolve becomes the value that await receives
            resolve({
                status: status.success,
                campaign_id: "camp_" + Math.random().toString(36).slice(2, 9),
                generated_summary: `Campaign created for "${brief.event}": targeting local audience with digital and print media.`
            });
        }, 2000);
    });
}