export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: number
          latitude: number
          longitude: number
          prediction_data: Json
          prediction_type: string
          user_id: string | null
          valid_until: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: number
          latitude: number
          longitude: number
          prediction_data: Json
          prediction_type: string
          user_id?: string | null
          valid_until: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: number
          latitude?: number
          longitude?: number
          prediction_data?: Json
          prediction_type?: string
          user_id?: string | null
          valid_until?: string
        }
        Relationships: []
      }
      alert_preferences: {
        Row: {
          created_at: string
          id: string
          max_crowd_level: number | null
          max_wave_height: number | null
          max_wind_speed: number | null
          min_wave_height: number | null
          notifications_enabled: boolean | null
          preferred_wind_direction: string | null
          spot_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_crowd_level?: number | null
          max_wave_height?: number | null
          max_wind_speed?: number | null
          min_wave_height?: number | null
          notifications_enabled?: boolean | null
          preferred_wind_direction?: string | null
          spot_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_crowd_level?: number | null
          max_wave_height?: number | null
          max_wind_speed?: number | null
          min_wave_height?: number | null
          notifications_enabled?: boolean | null
          preferred_wind_direction?: string | null
          spot_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          key_value: string
          service_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          key_value: string
          service_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          key_value?: string
          service_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          feature_name: string
          id: number
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      buddy_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          requested_id: string
          requester_id: string
          status: Database["public"]["Enums"]["buddy_request_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          requested_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["buddy_request_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          requested_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["buddy_request_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      challenge_leaderboard: {
        Row: {
          challenge_id: string
          id: string
          last_updated: string | null
          progress_data: Json | null
          rank: number | null
          score: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          last_updated?: string | null
          progress_data?: Json | null
          rank?: number | null
          score: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          last_updated?: string | null
          progress_data?: Json | null
          rank?: number | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_leaderboard_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          badge_icon: string | null
          badge_name: string | null
          category: string | null
          created_at: string
          criteria: Json
          current_participants: number | null
          description: string
          difficulty: string | null
          end_date: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          reward_points: number | null
          start_date: string | null
          type: string
          updated_at: string
        }
        Insert: {
          badge_icon?: string | null
          badge_name?: string | null
          category?: string | null
          created_at?: string
          criteria: Json
          current_participants?: number | null
          description: string
          difficulty?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          reward_points?: number | null
          start_date?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          badge_icon?: string | null
          badge_name?: string | null
          category?: string | null
          created_at?: string
          criteria?: Json
          current_participants?: number | null
          description?: string
          difficulty?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          reward_points?: number | null
          start_date?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      crowd_reports: {
        Row: {
          created_at: string | null
          id: string
          reported_level: string
          source: string | null
          spot_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reported_level: string
          source?: string | null
          spot_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reported_level?: string
          source?: string | null
          spot_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      data_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_type: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      fcm_tokens: {
        Row: {
          active: boolean | null
          created_at: string | null
          device_info: Json | null
          id: string
          token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          token: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fcm_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gdpr_consents: {
        Row: {
          consent_type: string
          created_at: string
          id: string
          is_granted: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          id?: string
          is_granted?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          id?: string
          is_granted?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "surf_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          id: string
          last_updated: string | null
          leaderboard_id: string
          period_end: string | null
          period_start: string | null
          rank: number | null
          score: number
          user_id: string
        }
        Insert: {
          id?: string
          last_updated?: string | null
          leaderboard_id: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score: number
          user_id: string
        }
        Update: {
          id?: string
          last_updated?: string | null
          leaderboard_id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          metric: string
          name: string
          spot_id: string | null
          time_period: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          metric: string
          name: string
          spot_id?: string | null
          time_period?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          metric?: string
          name?: string
          spot_id?: string | null
          time_period?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_bookings: {
        Row: {
          created_at: string
          duration_hours: number
          id: string
          instructor_id: string
          instructor_notes: string | null
          lesson_date: string
          lesson_type: string
          location_description: string | null
          location_spot_id: string | null
          payment_status: string | null
          rating: number | null
          special_requests: string | null
          status: string | null
          student_count: number | null
          student_feedback: string | null
          student_id: string
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_hours?: number
          id?: string
          instructor_id: string
          instructor_notes?: string | null
          lesson_date: string
          lesson_type: string
          location_description?: string | null
          location_spot_id?: string | null
          payment_status?: string | null
          rating?: number | null
          special_requests?: string | null
          status?: string | null
          student_count?: number | null
          student_feedback?: string | null
          student_id: string
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_hours?: number
          id?: string
          instructor_id?: string
          instructor_notes?: string | null
          lesson_date?: string
          lesson_type?: string
          location_description?: string | null
          location_spot_id?: string | null
          payment_status?: string | null
          rating?: number | null
          special_requests?: string | null
          status?: string | null
          student_count?: number | null
          student_feedback?: string | null
          student_id?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          brand: string | null
          category: string
          condition: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          images: string[] | null
          location_city: string | null
          location_country: string | null
          model: string | null
          price: number
          size_info: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category: string
          condition?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location_city?: string | null
          location_country?: string | null
          model?: string | null
          price: number
          size_info?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string
          condition?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location_city?: string | null
          location_country?: string | null
          model?: string | null
          price?: number
          size_info?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          mentor_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          mentor_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          mentor_id?: string | null
          start_time?: string
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          mentor_feedback: string | null
          mentor_id: string | null
          rating: number | null
          scheduled_at: string
          session_notes: string | null
          spot_id: string
          status: string | null
          student_feedback: string | null
          student_id: string | null
          updated_at: string | null
          video_call_url: string | null
          wave_conditions: Json | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentor_feedback?: string | null
          mentor_id?: string | null
          rating?: number | null
          scheduled_at: string
          session_notes?: string | null
          spot_id: string
          status?: string | null
          student_feedback?: string | null
          student_id?: string | null
          updated_at?: string | null
          video_call_url?: string | null
          wave_conditions?: Json | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentor_feedback?: string | null
          mentor_id?: string | null
          rating?: number | null
          scheduled_at?: string
          session_notes?: string | null
          spot_id?: string
          status?: string | null
          student_feedback?: string | null
          student_id?: string | null
          updated_at?: string | null
          video_call_url?: string | null
          wave_conditions?: Json | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          challenge_alerts: boolean | null
          created_at: string
          crowd_alerts: boolean | null
          daily_forecast: boolean | null
          id: string
          session_reminders: boolean | null
          updated_at: string
          user_id: string
          wave_alerts: boolean | null
        }
        Insert: {
          challenge_alerts?: boolean | null
          created_at?: string
          crowd_alerts?: boolean | null
          daily_forecast?: boolean | null
          id?: string
          session_reminders?: boolean | null
          updated_at?: string
          user_id: string
          wave_alerts?: boolean | null
        }
        Update: {
          challenge_alerts?: boolean | null
          created_at?: string
          crowd_alerts?: boolean | null
          daily_forecast?: boolean | null
          id?: string
          session_reminders?: boolean | null
          updated_at?: string
          user_id?: string
          wave_alerts?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: number
          message: string
          notification_type: string
          read: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: never
          message: string
          notification_type: string
          read?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: never
          message?: string
          notification_type?: string
          read?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      parking_spots: {
        Row: {
          address: string | null
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_available: boolean | null
          latitude: number
          location: unknown | null
          longitude: number
          max_duration_hours: number | null
          price_per_hour: number | null
          reported_by: string | null
          restrictions: string[] | null
          spot_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_available?: boolean | null
          latitude: number
          location?: unknown | null
          longitude: number
          max_duration_hours?: number | null
          price_per_hour?: number | null
          reported_by?: string | null
          restrictions?: string[] | null
          spot_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_available?: boolean | null
          latitude?: number
          location?: unknown | null
          longitude?: number
          max_duration_hours?: number | null
          price_per_hour?: number | null
          reported_by?: string | null
          restrictions?: string[] | null
          spot_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contest_entries: {
        Row: {
          contest_id: string
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          photo_url: string
          taken_at: string | null
          title: string
          user_id: string
          vote_count: number | null
        }
        Insert: {
          contest_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          photo_url: string
          taken_at?: string | null
          title: string
          user_id: string
          vote_count?: number | null
        }
        Update: {
          contest_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          photo_url?: string
          taken_at?: string | null
          title?: string
          user_id?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_contest_entries_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "photo_contests"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contest_votes: {
        Row: {
          created_at: string | null
          entry_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_contest_votes_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "photo_contest_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contests: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          max_entries_per_user: number | null
          prize_description: string | null
          start_date: string
          status: string | null
          theme: string | null
          title: string
          updated_at: string | null
          voting_end_date: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          max_entries_per_user?: number | null
          prize_description?: string | null
          start_date: string
          status?: string | null
          theme?: string | null
          title: string
          updated_at?: string | null
          voting_end_date: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          max_entries_per_user?: number | null
          prize_description?: string | null
          start_date?: string
          status?: string | null
          theme?: string | null
          title?: string
          updated_at?: string | null
          voting_end_date?: string
        }
        Relationships: []
      }
      premium_weather_data: {
        Row: {
          accuracy_score: number | null
          created_at: string
          data_source: string | null
          detailed_forecast: Json
          forecast_date: string
          id: string
          spot_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          data_source?: string | null
          detailed_forecast: Json
          forecast_date: string
          id?: string
          spot_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          data_source?: string | null
          detailed_forecast?: Json
          forecast_date?: string
          id?: string
          spot_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certification_level: string | null
          created_at: string
          email: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          reputation_score: number | null
          skill_level: number | null
          timezone: string | null
          total_reports: number | null
          updated_at: string
          user_type: string | null
          username: string | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certification_level?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          reputation_score?: number | null
          skill_level?: number | null
          timezone?: string | null
          total_reports?: number | null
          updated_at?: string
          user_type?: string | null
          username?: string | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certification_level?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          reputation_score?: number | null
          skill_level?: number | null
          timezone?: string | null
          total_reports?: number | null
          updated_at?: string
          user_type?: string | null
          username?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      real_parking_spots: {
        Row: {
          address: string | null
          available_spaces: number | null
          created_at: string | null
          id: string
          is_available: boolean | null
          last_updated: string | null
          latitude: number
          longitude: number
          metadata: Json | null
          name: string
          price_per_hour: number | null
          provider: string
          provider_id: string
          real_time_data: boolean | null
          spot_type: string | null
          total_spaces: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          available_spaces?: number | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          last_updated?: string | null
          latitude: number
          longitude: number
          metadata?: Json | null
          name: string
          price_per_hour?: number | null
          provider: string
          provider_id: string
          real_time_data?: boolean | null
          spot_type?: string | null
          total_spaces?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          available_spaces?: number | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          last_updated?: string | null
          latitude?: number
          longitude?: number
          metadata?: Json | null
          name?: string
          price_per_hour?: number | null
          provider?: string
          provider_id?: string
          real_time_data?: boolean | null
          spot_type?: string | null
          total_spaces?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "session_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      session_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "session_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      session_posts: {
        Row: {
          comment_count: number | null
          created_at: string | null
          crowd_level: string | null
          description: string | null
          fun_rating: number | null
          id: string
          like_count: number | null
          location: string | null
          photos: string[] | null
          session_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
          wave_rating: number | null
        }
        Insert: {
          comment_count?: number | null
          created_at?: string | null
          crowd_level?: string | null
          description?: string | null
          fun_rating?: number | null
          id?: string
          like_count?: number | null
          location?: string | null
          photos?: string[] | null
          session_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          wave_rating?: number | null
        }
        Update: {
          comment_count?: number | null
          created_at?: string | null
          crowd_level?: string | null
          description?: string | null
          fun_rating?: number | null
          id?: string
          like_count?: number | null
          location?: string | null
          photos?: string[] | null
          session_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          wave_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_posts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "surf_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_recordings: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          recording_url: string
          session_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          recording_url: string
          session_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          recording_url?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentorship_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      spot_reports: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          photo_url: string | null
          report_type: string
          reporter_id: string | null
          spot_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          report_type: string
          reporter_id?: string | null
          spot_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          report_type?: string
          reporter_id?: string | null
          spot_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_reports_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          rating: number
          reviewer_id: string | null
          spot_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          rating: number
          reviewer_id?: string | null
          spot_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          rating?: number
          reviewer_id?: string | null
          spot_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan_name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      surf_groups: {
        Row: {
          beach_region: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          group_image: string | null
          id: string
          location: string
          max_members: number | null
          member_count: number | null
          name: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["group_visibility"] | null
        }
        Insert: {
          beach_region?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          group_image?: string | null
          id?: string
          location: string
          max_members?: number | null
          member_count?: number | null
          name: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Update: {
          beach_region?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          group_image?: string | null
          id?: string
          location?: string
          max_members?: number | null
          member_count?: number | null
          name?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Relationships: []
      }
      surf_instructors: {
        Row: {
          availability_schedule: Json | null
          bio: string | null
          certifications: string[] | null
          contact_info: Json | null
          created_at: string
          experience_years: number | null
          hourly_rate: number
          id: string
          instructor_name: string
          is_verified: boolean | null
          languages: string[] | null
          location_city: string
          location_country: string
          profile_image: string | null
          rating: number | null
          specialties: string[] | null
          status: string | null
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_schedule?: Json | null
          bio?: string | null
          certifications?: string[] | null
          contact_info?: Json | null
          created_at?: string
          experience_years?: number | null
          hourly_rate: number
          id?: string
          instructor_name: string
          is_verified?: boolean | null
          languages?: string[] | null
          location_city: string
          location_country: string
          profile_image?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_schedule?: Json | null
          bio?: string | null
          certifications?: string[] | null
          contact_info?: Json | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number
          id?: string
          instructor_name?: string
          is_verified?: boolean | null
          languages?: string[] | null
          location_city?: string
          location_country?: string
          profile_image?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      surf_sessions: {
        Row: {
          conditions_snapshot: Json | null
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          rating: number | null
          session_date: string
          spot_id: string
          spot_name: string | null
          user_id: string
          wave_count: number | null
        }
        Insert: {
          conditions_snapshot?: Json | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rating?: number | null
          session_date: string
          spot_id: string
          spot_name?: string | null
          user_id: string
          wave_count?: number | null
        }
        Update: {
          conditions_snapshot?: Json | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rating?: number | null
          session_date?: string
          spot_id?: string
          spot_name?: string | null
          user_id?: string
          wave_count?: number | null
        }
        Relationships: []
      }
      surf_spots: {
        Row: {
          "amenities/0": string | null
          "amenities/1": string | null
          "amenities/2": string | null
          "amenities/3": string | null
          "amenities/4": string | null
          best_season: string | null
          best_tide: string | null
          bottom_type: string | null
          break_type: string | null
          country: string | null
          crowd_levels: string | null
          description: string | null
          difficulty: string | null
          "hazards/0": string | null
          "hazards/1": string | null
          "hazards/2": string | null
          "hazards/3": string | null
          "hazards/4": string | null
          "hazards/5": string | null
          id: number
          ideal_swell_direction: string | null
          lat: number | null
          lon: number | null
          name: string | null
          parking: string | null
          point_break: boolean | null
          region: string | null
          state: string | null
          water_temp_range: string | null
          wave_direction: string | null
          wave_height_range: string | null
          wind_direction: string | null
        }
        Insert: {
          "amenities/0"?: string | null
          "amenities/1"?: string | null
          "amenities/2"?: string | null
          "amenities/3"?: string | null
          "amenities/4"?: string | null
          best_season?: string | null
          best_tide?: string | null
          bottom_type?: string | null
          break_type?: string | null
          country?: string | null
          crowd_levels?: string | null
          description?: string | null
          difficulty?: string | null
          "hazards/0"?: string | null
          "hazards/1"?: string | null
          "hazards/2"?: string | null
          "hazards/3"?: string | null
          "hazards/4"?: string | null
          "hazards/5"?: string | null
          id?: number
          ideal_swell_direction?: string | null
          lat?: number | null
          lon?: number | null
          name?: string | null
          parking?: string | null
          point_break?: boolean | null
          region?: string | null
          state?: string | null
          water_temp_range?: string | null
          wave_direction?: string | null
          wave_height_range?: string | null
          wind_direction?: string | null
        }
        Update: {
          "amenities/0"?: string | null
          "amenities/1"?: string | null
          "amenities/2"?: string | null
          "amenities/3"?: string | null
          "amenities/4"?: string | null
          best_season?: string | null
          best_tide?: string | null
          bottom_type?: string | null
          break_type?: string | null
          country?: string | null
          crowd_levels?: string | null
          description?: string | null
          difficulty?: string | null
          "hazards/0"?: string | null
          "hazards/1"?: string | null
          "hazards/2"?: string | null
          "hazards/3"?: string | null
          "hazards/4"?: string | null
          "hazards/5"?: string | null
          id?: number
          ideal_swell_direction?: string | null
          lat?: number | null
          lon?: number | null
          name?: string | null
          parking?: string | null
          point_break?: boolean | null
          region?: string | null
          state?: string | null
          water_temp_range?: string | null
          wave_direction?: string | null
          wave_height_range?: string | null
          wind_direction?: string | null
        }
        Relationships: []
      }
      travel_bookings: {
        Row: {
          booking_status: string | null
          contact_info: Json | null
          created_at: string
          id: string
          package_id: string
          participant_count: number
          payment_status: string | null
          special_requests: string | null
          total_price: number
          travel_dates: unknown
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_status?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          package_id: string
          participant_count: number
          payment_status?: string | null
          special_requests?: string | null
          total_price: number
          travel_dates: unknown
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_status?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          package_id?: string
          participant_count?: number
          payment_status?: string | null
          special_requests?: string | null
          total_price?: number
          travel_dates?: unknown
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_packages: {
        Row: {
          best_season: string | null
          created_at: string
          description: string
          destination: string
          difficulty_level: string
          duration_days: number
          id: string
          included_services: string[] | null
          max_participants: number | null
          operator_contact: Json | null
          package_images: string[] | null
          package_name: string
          price_per_person: number
          status: string | null
          surf_spots: string[] | null
          updated_at: string
          weather_requirements: Json | null
        }
        Insert: {
          best_season?: string | null
          created_at?: string
          description: string
          destination: string
          difficulty_level: string
          duration_days: number
          id?: string
          included_services?: string[] | null
          max_participants?: number | null
          operator_contact?: Json | null
          package_images?: string[] | null
          package_name: string
          price_per_person: number
          status?: string | null
          surf_spots?: string[] | null
          updated_at?: string
          weather_requirements?: Json | null
        }
        Update: {
          best_season?: string | null
          created_at?: string
          description?: string
          destination?: string
          difficulty_level?: string
          duration_days?: number
          id?: string
          included_services?: string[] | null
          max_participants?: number | null
          operator_contact?: Json | null
          package_images?: string[] | null
          package_name?: string
          price_per_person?: number
          status?: string | null
          surf_spots?: string[] | null
          updated_at?: string
          weather_requirements?: Json | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          challenge_id: string
          earned_at: string
          id: string
          points_earned: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          earned_at?: string
          id?: string
          points_earned?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          earned_at?: string
          id?: string
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements_detailed: {
        Row: {
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          badge_color: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string | null
          icon: string | null
          id: string
          is_unlocked: boolean | null
          points_awarded: number | null
          progress_current: number | null
          progress_required: number | null
          rarity: string | null
          unlock_criteria: Json | null
          unlocked_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          badge_color?: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          icon?: string | null
          id?: string
          is_unlocked?: boolean | null
          points_awarded?: number | null
          progress_current?: number | null
          progress_required?: number | null
          rarity?: string | null
          unlock_criteria?: Json | null
          unlocked_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          badge_color?: string | null
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          icon?: string | null
          id?: string
          is_unlocked?: boolean | null
          points_awarded?: number | null
          progress_current?: number | null
          progress_required?: number | null
          rarity?: string | null
          unlock_criteria?: Json | null
          unlocked_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          progress_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          spot_id: string
          spot_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          spot_id: string
          spot_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          spot_id?: string
          spot_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_name: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          achievements_count: number | null
          created_at: string
          current_streak: number | null
          id: string
          level: number | null
          longest_streak: number | null
          total_points: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_count?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_points?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_count?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_points?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_parking_demand: {
        Args: { center_lat: number; center_lng: number; radius_meters?: number }
        Returns: {
          total_spots: number
          available_spots: number
          demand_ratio: number
          avg_confidence: number
        }[]
      }
      calculate_user_level: {
        Args: { points: number }
        Returns: number
      }
      cleanup_expired_spots: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_ai_prediction: {
        Args: {
          pred_lat: number
          pred_lng: number
          pred_type: string
          pred_data: Json
          confidence: number
          valid_hours?: number
        }
        Returns: string
      }
      delete_inactive_user_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      encrypt_api_key: {
        Args: { key_value: string }
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      find_nearby_real_spots: {
        Args: {
          user_lat: number
          user_lng: number
          radius_meters?: number
          spot_type_filter?: string
          max_price?: number
          only_available?: boolean
          require_real_time?: boolean
        }
        Returns: {
          id: string
          provider: string
          provider_id: string
          name: string
          latitude: number
          longitude: number
          address: string
          spot_type: string
          price_per_hour: number
          is_available: boolean
          total_spaces: number
          available_spaces: number
          real_time_data: boolean
          distance_meters: number
          metadata: Json
          last_updated: string
        }[]
      }
      find_nearby_spots: {
        Args: {
          user_lat: number
          user_lng: number
          radius_meters?: number
          spot_type_filter?: string
          max_price?: number
          only_available?: boolean
        }
        Returns: {
          id: string
          latitude: number
          longitude: number
          address: string
          spot_type: string
          is_available: boolean
          distance_meters: number
          expires_at: string
          confidence_score: number
          price_per_hour: number
          max_duration_hours: number
          created_at: string
          reporter_name: string
          avg_rating: number
        }[]
      }
      find_nearby_spots_simple: {
        Args: { user_lat: number; user_lng: number; radius_meters?: number }
        Returns: {
          id: string
          latitude: number
          longitude: number
          address: string
          spot_type: string
          is_available: boolean
          distance_meters: number
        }[]
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_spot_rating: {
        Args: { spot_id: number }
        Returns: number
      }
      get_table_row_count: {
        Args: { schema_name: string; table_name: string }
        Returns: number
      }
      get_user_profile: {
        Args: { user_id: string }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          reputation_score: number
          total_reports: number
          created_at: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_stats: {
        Args: { user_id: string }
        Returns: {
          total_reports: number
          successful_reports: number
          reputation_score: number
          avg_spot_rating: number
          total_reviews: number
        }[]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      test_database_setup: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_user_reputation: {
        Args: { user_id: string; reputation_change: number }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      achievement_category:
        | "sessions"
        | "streaks"
        | "exploration"
        | "social"
        | "challenges"
        | "special"
      app_role: "admin" | "mentor" | "student"
      buddy_request_status: "pending" | "accepted" | "declined"
      group_visibility: "public" | "private"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "sessions",
        "streaks",
        "exploration",
        "social",
        "challenges",
        "special",
      ],
      app_role: ["admin", "mentor", "student"],
      buddy_request_status: ["pending", "accepted", "declined"],
      group_visibility: ["public", "private"],
    },
  },
} as const
