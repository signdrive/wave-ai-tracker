export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      profiles: {
        Row: {
          bio: string | null
          certification_level: string | null
          created_at: string
          email: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          skill_level: number | null
          timezone: string | null
          updated_at: string
          user_type: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          certification_level?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          skill_level?: number | null
          timezone?: string | null
          updated_at?: string
          user_type?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          certification_level?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          skill_level?: number | null
          timezone?: string | null
          updated_at?: string
          user_type?: string | null
          years_experience?: number | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "mentor" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "mentor", "student"],
    },
  },
} as const
