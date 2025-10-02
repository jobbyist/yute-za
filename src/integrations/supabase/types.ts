export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          date_of_birth: string | null
          phone_number: string | null
          financial_goals: string | null
          risk_tolerance_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          date_of_birth?: string | null
          phone_number?: string | null
          financial_goals?: string | null
          risk_tolerance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          date_of_birth?: string | null
          phone_number?: string | null
          financial_goals?: string | null
          risk_tolerance_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
        }
      }
      stokie_circles: {
        Row: {
          id: string
          name: string
          description: string | null
          goal_description: string
          target_amount: number
          current_amount: number
          monthly_contribution: number
          is_private: boolean
          creator_id: string
          payout_type: 'rotating' | 'lump_sum'
          next_payout_date: string | null
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          goal_description: string
          target_amount: number
          current_amount?: number
          monthly_contribution: number
          is_private?: boolean
          creator_id: string
          payout_type: 'rotating' | 'lump_sum'
          next_payout_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          goal_description?: string
          target_amount?: number
          current_amount?: number
          monthly_contribution?: number
          is_private?: boolean
          creator_id?: string
          payout_type?: 'rotating' | 'lump_sum'
          next_payout_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      circle_members: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          role: 'creator' | 'admin' | 'member'
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          role?: 'creator' | 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          role?: 'creator' | 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
      }
      contributions: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          amount: number
          contribution_date: string
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_reference: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          amount: number
          contribution_date?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_reference?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          amount?: number
          contribution_date?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_reference?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      circle_messages: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
      payout_votes: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          vote_type: 'approve' | 'reject' | 'abstain'
          payout_proposal_id: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          vote_type: 'approve' | 'reject' | 'abstain'
          payout_proposal_id: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          vote_type?: 'approve' | 'reject' | 'abstain'
          payout_proposal_id?: string
          reason?: string | null
          created_at?: string
        }
      }
      learning_paths: {
        Row: {
          id: string
          name: string
          description: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tier: 'free' | 'pro' | 'elite'
          icon: string | null
          color: string | null
          estimated_duration_hours: number | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tier: 'free' | 'pro' | 'elite'
          icon?: string | null
          color?: string | null
          estimated_duration_hours?: number | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          tier?: 'free' | 'pro' | 'elite'
          icon?: string | null
          color?: string | null
          estimated_duration_hours?: number | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          learning_path_id: string
          title: string
          description: string | null
          content_type: 'video' | 'audio' | 'text' | 'quiz' | 'interactive'
          content_url: string | null
          duration_minutes: number | null
          sort_order: number
          xp_reward: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          learning_path_id: string
          title: string
          description?: string | null
          content_type: 'video' | 'audio' | 'text' | 'quiz' | 'interactive'
          content_url?: string | null
          duration_minutes?: number | null
          sort_order?: number
          xp_reward?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          learning_path_id?: string
          title?: string
          description?: string | null
          content_type?: 'video' | 'audio' | 'text' | 'quiz' | 'interactive'
          content_url?: string | null
          duration_minutes?: number | null
          sort_order?: number
          xp_reward?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          learning_path_id: string
          progress_percentage: number
          is_completed: boolean
          completed_at: string | null
          last_accessed_at: string
          quiz_score: number | null
          time_spent_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          learning_path_id: string
          progress_percentage?: number
          is_completed?: boolean
          completed_at?: string | null
          last_accessed_at?: string
          quiz_score?: number | null
          time_spent_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          learning_path_id?: string
          progress_percentage?: number
          is_completed?: boolean
          completed_at?: string | null
          last_accessed_at?: string
          quiz_score?: number | null
          time_spent_minutes?: number
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          badge_type: 'achievement' | 'milestone' | 'special'
          criteria_type: 'courses_completed' | 'xp_earned' | 'streak_days' | 'perfect_quiz'
          criteria_value: number
          xp_bonus: number
          tier: 'free' | 'pro' | 'elite' | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          badge_type: 'achievement' | 'milestone' | 'special'
          criteria_type: 'courses_completed' | 'xp_earned' | 'streak_days' | 'perfect_quiz'
          criteria_value: number
          xp_bonus?: number
          tier?: 'free' | 'pro' | 'elite' | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          badge_type?: 'achievement' | 'milestone' | 'special'
          criteria_type?: 'courses_completed' | 'xp_earned' | 'streak_days' | 'perfect_quiz'
          criteria_value?: number
          xp_bonus?: number
          tier?: 'free' | 'pro' | 'elite' | null
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
      user_xp: {
        Row: {
          id: string
          user_id: string
          total_xp: number
          level: number
          current_streak_days: number
          longest_streak_days: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_xp?: number
          level?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_xp?: number
          level?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<string, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "free" | "premium" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
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
      app_role: ["free", "premium", "admin"] as const,
    },
  },
} as const
