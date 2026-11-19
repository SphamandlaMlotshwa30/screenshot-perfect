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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      allocations: {
        Row: {
          allocated_to: string
          allocation_date: string
          challenge_id: string
          id: string
          status: string
          supervisor_id: string
        }
        Insert: {
          allocated_to: string
          allocation_date?: string
          challenge_id: string
          id?: string
          status?: string
          supervisor_id: string
        }
        Update: {
          allocated_to?: string
          allocation_date?: string
          challenge_id?: string
          id?: string
          status?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "allocations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      challenge_scores: {
        Row: {
          challenge_id: string
          criterion_id: string
          evaluator_id: string
          score: number
        }
        Insert: {
          challenge_id: string
          criterion_id: string
          evaluator_id: string
          score: number
        }
        Update: {
          challenge_id?: string
          criterion_id?: string
          evaluator_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_scores_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_scores_criterion_id_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          allocated_to: string | null
          category: string
          created_at: string
          department: string
          description: string
          feedback: string
          id: string
          is_demo: boolean
          priority: string
          recommended: boolean
          status: string
          submitted_by: string | null
          submitter_name: string
          supervisor_id: string | null
          supporting_file: string | null
          title: string
          weighted_score: number | null
        }
        Insert: {
          allocated_to?: string | null
          category: string
          created_at?: string
          department: string
          description: string
          feedback?: string
          id?: string
          is_demo?: boolean
          priority?: string
          recommended?: boolean
          status?: string
          submitted_by?: string | null
          submitter_name?: string
          supervisor_id?: string | null
          supporting_file?: string | null
          title: string
          weighted_score?: number | null
        }
        Update: {
          allocated_to?: string | null
          category?: string
          created_at?: string
          department?: string
          description?: string
          feedback?: string
          id?: string
          is_demo?: boolean
          priority?: string
          recommended?: boolean
          status?: string
          submitted_by?: string | null
          submitter_name?: string
          supervisor_id?: string | null
          supporting_file?: string | null
          title?: string
          weighted_score?: number | null
        }
        Relationships: []
      }
      criteria: {
        Row: {
          criterion_name: string
          id: string
          weight: number
        }
        Insert: {
          criterion_name: string
          id?: string
          weight: number
        }
        Update: {
          criterion_name?: string
          id?: string
          weight?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          fullname: string
          id: string
          member_number: string
          requested_role: string
        }
        Insert: {
          created_at?: string
          email: string
          fullname: string
          id: string
          member_number?: string
          requested_role?: string
        }
        Update: {
          created_at?: string
          email?: string
          fullname?: string
          id?: string
          member_number?: string
          requested_role?: string
        }
        Relationships: []
      }
      progress_reports: {
        Row: {
          challenge_id: string
          description: string
          evidence_file: string | null
          id: string
          report_date: string
          user_id: string
          verified: boolean
        }
        Insert: {
          challenge_id: string
          description: string
          evidence_file?: string | null
          id?: string
          report_date?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          challenge_id?: string
          description?: string
          evidence_file?: string | null
          id?: string
          report_date?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "progress_reports_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      campus_action: { Args: { payload: Json }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "supervisor" | "representative" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "supervisor", "representative", "student"],
    },
  },
} as const
