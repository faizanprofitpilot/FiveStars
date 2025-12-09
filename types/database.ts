export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          business_name: string
          google_profile_url: string | null
          context_document: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          google_profile_url?: string | null
          context_document?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          google_profile_url?: string | null
          context_document?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          business_id: string
          name: string
          primary_channel: 'sms' | 'email' | 'none'
          secondary_channel: 'sms' | 'email' | 'none' | null
          primary_template: string
          followup_template: string | null
          followup_enabled: boolean
          followup_delay: number | null
          campaign_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          primary_channel: 'sms' | 'email' | 'none'
          secondary_channel?: 'sms' | 'email' | 'none' | null
          primary_template: string
          followup_template?: string | null
          followup_enabled?: boolean
          followup_delay?: number | null
          campaign_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          primary_channel?: 'sms' | 'email' | 'none'
          secondary_channel?: 'sms' | 'email' | 'none' | null
          primary_template?: string
          followup_template?: string | null
          followup_enabled?: boolean
          followup_delay?: number | null
          campaign_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      review_requests: {
        Row: {
          id: string
          campaign_id: string
          customer_first_name: string
          customer_phone: string | null
          customer_email: string | null
          primary_sent: boolean
          secondary_sent: boolean
          followup_sent: boolean
          primary_channel: string | null
          secondary_channel: string | null
          error_message: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          customer_first_name: string
          customer_phone?: string | null
          customer_email?: string | null
          primary_sent?: boolean
          secondary_sent?: boolean
          followup_sent?: boolean
          primary_channel?: string | null
          secondary_channel?: string | null
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          customer_first_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          primary_sent?: boolean
          secondary_sent?: boolean
          followup_sent?: boolean
          primary_channel?: string | null
          secondary_channel?: string | null
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
      review_replies: {
        Row: {
          id: string
          business_id: string
          review_text: string
          generated_reply: string
          tone: 'professional' | 'friendly' | 'apology' | 'short'
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          review_text: string
          generated_reply: string
          tone: 'professional' | 'friendly' | 'apology' | 'short'
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          review_text?: string
          generated_reply?: string
          tone?: 'professional' | 'friendly' | 'apology' | 'short'
          created_at?: string
        }
      }
    }
  }
}

