import React, { useState } from 'react';
import { returnAgent } from '../lib/api/market';
import type { CampaignBrief, AgentResponse, FormStatus } from '../types/types';
import { status } from '../types/types';

const CampaignForm: React.FC = () => {
    // Form field state — each input gets its own useState
    const [desc, setDesc] = useState('');
    const [event, setEvent] = useState('');
    const [time, setTime] = useState('');
    const [city, setCity] = useState('');
    const [venue, setVenue] = useState('');
    const [capacity, setCapacity] = useState('');

    // Lifecycle state — separate from form data
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [response, setResponse] = useState<AgentResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent the browser's default form submission (which reloads the page)
        e.preventDefault();

        // Build the CampaignBrief from individual state values
        const brief: CampaignBrief = {
            desc,
            event,
            time: new Date(time),
            // optional fields included if the user filled them in
            ...(city && { city }),
            ...(venue && { venue_name: venue }),
            ...(capacity && { capacity: Number(capacity) }),
        };

        setFormStatus('processing');
        setResponse(null);

        try { // calls returnAgent from market.ts
            const result = await returnAgent(brief);
            setResponse(result);
            setFormStatus('complete');
        } catch {
            setFormStatus('error');
        }
    };

    const handleRetry = () => {
        setFormStatus('idle');
        setResponse(null);
    };

    // Render different UI based on where we are in the lifecycle
    if (formStatus === 'processing') {
        return <p>Generating campaign...</p>;
    }

    if (formStatus === 'error') {
        return (
            <div>
                <p>Something went wrong.</p>
                <button onClick={handleRetry}>Try Again</button>
            </div>
        );
    }

    if (formStatus === 'complete' && response) {
        return (
            <div>
                {response.status === status.success ? (
                    <div>
                        <h2>Campaign Created</h2>
                        <p><strong>ID:</strong> {response.campaign_id}</p>
                        <p>{response.generated_summary}</p>
                    </div>
                ) : (
                    <p>Campaign creation failed.</p>
                )}
                <button onClick={handleRetry}>New Campaign</button>
            </div>
        );
    }

    // Default: idle state — show the form
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h4> * means required field. </h4>
            </div>
            <div>
                <label>Event Name *</label>
                <input value={event} onChange={(e) => setEvent(e.target.value)} required />
            </div>
            <div>
                <label>Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required />
            </div>
            <div>
                <label>Date/Time *</label>
                <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div>
                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
                <label>Venue</label>
                <input value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>
            <div>
                <label>Capacity</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
            <button type="submit">Generate Campaign</button>
        </form>
    );
};

export default CampaignForm;
