export interface Pick {
    id: string
    horse_name: string
    track_name: string
    race_number: number
    odds: number
    adam_notes: string
    race_date: string
    status: string
    bet_type?: string
    start_method?: string
    start_lane?: number
    distance?: string
    bookmaker?: string
    stake?: string
    equipment?: string
    driver?: string
    value?: string
    start_time?: string

    // New Cody Fields
    final_output_message: string | null
    ai_score: number | null
    prime_pick_rank: number | null
    value_percent: number | null
    is_prime_pick: boolean

    // Stats
    result_payout: number | null
    net_result: number | null
    yesterday_result: number | null

    // Analysis Data
    statistics?: string
    interview_info?: string
    form_score_7d?: number
    form_score_30d?: number

    ai_analysis: {
        summary: string
        risk_level: string
    } | null
}

export interface CalendarEvent {
    id: string
    race_date: string
    title: string
    type: string // 'V75', 'V86', 'Big Slam'
    description?: string
    status: string // 'upcoming', 'completed'
    priority?: string // 'high', 'medium', 'low'
    bet_type?: string
    risk_level?: string
    comment?: string
    is_visible: boolean
    detailed_description?: string
    motivation?: string

    // Betting / Result Fields
    odds?: number
    stake?: string
    horse_name?: string
    driver?: string
    location?: string
    net_result?: number
    result_status?: string
}

export interface Profile {
    id: string;
    email?: string; // Often not in public table, but useful if we merge data
    full_name?: string;
    avatar_url?: string;
    role: 'user' | 'admin' | 'moderator';
    subscription_tier?: string;
    created_at?: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    type: 'blog' | 'news' | 'report' | 'guide';
    status: 'draft' | 'published';
    published_at: string | null;
    meta_title: string;
    meta_description: string;
    cover_image: string | null;
    author_id: string;
    created_at: string;
    updated_at: string;
}

export interface HorseInfo {
    id: string;
    horse_name: string;
    birth_year: number;
    sex: string;
    trainer: string;
    default_driver: string;
    strength_tags: string;
    weakness_tags: string;
    notes_short: string;
}
