export interface SupabaseLead {
    id: number;
    created_at: string;
    post_title: string | null;
    post_url: string | null;
    author_name: string | null;
    author_url: string | null;
    author_description: string | null;
}

export interface AILead {
    id?: number;
    created_at?: string;
    full_name: string;
    interests: string;
    success_rate: number;
    phone?: string | null;
    email?: string | null;
    profile_url: string;
    post_text: string;
    post_summary: string;
    message_content: string;
}

export type Page = 'dashboard' | 'realtime' | 'saved' | 'search';

// This is just a placeholder to keep the old Tab enum for any potential internal logic
// The new navigation will use the 'Page' type.
export enum Tab {
    AI_ANALYSIS = 'ai-analysis-tab',
    REALTIME = 'realtime-tab',
    SEARCH = 'search-tab',
    SAVED_LEADS = 'saved-leads-tab',
}