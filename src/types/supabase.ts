export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            stories: {
                Row: {
                    id: number
                    created_at: string
                    content: string
                    tag: string[]
                    likes_count: number
                    is_anonymous: boolean
                    user_id: string | null
                }
                Insert: {
                    id?: number
                    created_at?: string
                    content: string
                    tag: string[]
                    likes_count?: number
                    is_anonymous?: boolean
                    user_id?: string | null
                }
                Update: {
                    id?: number
                    created_at?: string
                    content?: string
                    tag?: string[]
                    likes_count?: number
                    is_anonymous?: boolean
                    user_id?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    avatar_url: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    username?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    username?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
            }
            comments: {
                Row: {
                    id: number
                    story_id: number
                    user_id: string | null
                    content: string
                    is_anonymous: boolean
                    created_at: string
                }
                Insert: {
                    id?: number
                    story_id: number
                    user_id?: string | null
                    content: string
                    is_anonymous?: boolean
                    created_at?: string
                }
                Update: {
                    id?: number
                    story_id?: number
                    user_id?: string | null
                    content?: string
                    is_anonymous?: boolean
                    created_at?: string
                }
            }
            base_profiles: {
                Row: {
                    id: string
                    username: string | null
                    avatar_url: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    username?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    username?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
