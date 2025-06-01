
export type UserRole = 'student' | 'mentor' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  user_type?: UserRole;
  certification_level?: string;
  skill_level?: number;
  years_experience?: number;
  hourly_rate?: number;
  bio?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorAvailability {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  student_id: string;
  spot_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  session_notes?: string;
  mentor_feedback?: string;
  student_feedback?: string;
  rating?: number;
  wave_conditions?: any;
  video_call_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecording {
  id: string;
  session_id: string;
  recording_url: string;
  duration_seconds?: number;
  ai_analysis?: any;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}
