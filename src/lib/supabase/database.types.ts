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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_catalog: {
        Row: {
          category: Database["public"]["Enums"]["activity_category"]
          code: string
          id: string
          is_active: boolean
          is_variable: boolean
          label: string
          level: string | null
          points: number | null
          proof_hint: string | null
          requires_proof: boolean
          scope: Database["public"]["Enums"]["activity_scope"]
          sort_order: number
        }
        Insert: {
          category: Database["public"]["Enums"]["activity_category"]
          code: string
          id?: string
          is_active?: boolean
          is_variable?: boolean
          label: string
          level?: string | null
          points?: number | null
          proof_hint?: string | null
          requires_proof?: boolean
          scope: Database["public"]["Enums"]["activity_scope"]
          sort_order?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["activity_category"]
          code?: string
          id?: string
          is_active?: boolean
          is_variable?: boolean
          label?: string
          level?: string | null
          points?: number | null
          proof_hint?: string | null
          requires_proof?: boolean
          scope?: Database["public"]["Enums"]["activity_scope"]
          sort_order?: number
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after: Json | null
          at: string
          before: Json | null
          entity: string
          entity_id: string | null
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          after?: Json | null
          at?: string
          before?: Json | null
          entity: string
          entity_id?: string | null
          id?: number
        }
        Update: {
          action?: string
          actor_id?: string | null
          after?: Json | null
          at?: string
          before?: Json | null
          entity?: string
          entity_id?: string | null
          id?: number
        }
        Relationships: []
      }
      central_code_map: {
        Row: {
          central_code: string
          local_code: string
        }
        Insert: {
          central_code: string
          local_code: string
        }
        Update: {
          central_code?: string
          local_code?: string
        }
        Relationships: []
      }
      central_config: {
        Row: {
          id: boolean
          ingest_url: string
          team_key: string
          updated_at: string
        }
        Insert: {
          id?: boolean
          ingest_url: string
          team_key: string
          updated_at?: string
        }
        Update: {
          id?: boolean
          ingest_url?: string
          team_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      central_outbox: {
        Row: {
          attempts: number
          created_at: string
          event_id: string
          id: number
          last_error: string | null
          payload: Json
          request_id: number | null
          sent_at: string | null
          status: string
          submission_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          event_id: string
          id?: number
          last_error?: string | null
          payload: Json
          request_id?: number | null
          sent_at?: string | null
          status?: string
          submission_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          event_id?: string
          id?: number
          last_error?: string | null
          payload?: Json
          request_id?: number | null
          sent_at?: string | null
          status?: string
          submission_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          department: string
          enrollment_no: string | null
          full_name: string
          id: string
          is_active: boolean
          sprint_track: Database["public"]["Enums"]["sprint_track"] | null
          team_id: string | null
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          department: string
          enrollment_no?: string | null
          full_name: string
          id: string
          is_active?: boolean
          sprint_track?: Database["public"]["Enums"]["sprint_track"] | null
          team_id?: string | null
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          department?: string
          enrollment_no?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          sprint_track?: Database["public"]["Enums"]["sprint_track"] | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sprint_config: {
        Row: {
          id: boolean
          sprint_start: string
          total_days: number
        }
        Insert: {
          id?: boolean
          sprint_start: string
          total_days?: number
        }
        Update: {
          id?: boolean
          sprint_start?: string
          total_days?: number
        }
        Relationships: []
      }
      submission_proofs: {
        Row: {
          file_name: string
          id: string
          mime_type: string
          size_bytes: number
          storage_path: string
          submission_id: string
          team_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          id?: string
          mime_type: string
          size_bytes: number
          storage_path: string
          submission_id: string
          team_id?: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          id?: string
          mime_type?: string
          size_bytes?: number
          storage_path?: string
          submission_id?: string
          team_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_proofs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_proofs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          activity_id: string
          awarded_points: number | null
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          details: string | null
          external_url: string | null
          id: string
          member_id: string
          net_points: number | null
          occurred_on: string
          override_reason: string | null
          penalty_points: number
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string
          team_id: string
          title: string
        }
        Insert: {
          activity_id: string
          awarded_points?: number | null
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          details?: string | null
          external_url?: string | null
          id?: string
          member_id: string
          net_points?: number | null
          occurred_on: string
          override_reason?: string | null
          penalty_points?: number
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          team_id: string
          title: string
        }
        Update: {
          activity_id?: string
          awarded_points?: number | null
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          details?: string | null
          external_url?: string | null
          id?: string
          member_id?: string
          net_points?: number | null
          occurred_on?: string
          override_reason?: string | null
          penalty_points?: number
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          team_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
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
      central_build_payload: {
        Args: { p_submission_id: string }
        Returns: Json
      }
      central_dispatch: { Args: never; Returns: undefined }
      central_reap: { Args: never; Returns: undefined }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      decide_submission: {
        Args: {
          p_decision: Database["public"]["Enums"]["submission_status"]
          p_note?: string
          p_override_points?: number
          p_override_reason?: string
          p_submission_id: string
        }
        Returns: undefined
      }
      get_meet_our_team: {
        Args: { p_team_id: string }
        Returns: {
          avatar_path: string
          department: string
          full_name: string
          id: string
        }[]
      }
      get_my_team_id: { Args: never; Returns: string }
      get_registration_status: { Args: never; Returns: string }
    }
    Enums: {
      activity_category:
        | "team_activity"
        | "individual"
        | "sprint_track"
        | "bonus"
      activity_scope: "team" | "individual"
      app_permission:
        | "submissions.verify"
        | "submissions.revoke"
        | "submissions.override_points"
        | "rules.edit"
        | "roles.manage"
        | "export.run"
        | "members.manage"
        | "meetups.manage"
      app_role: "member" | "core" | "lead"
      sprint_track: "code" | "open_source" | "build" | "pitch"
      submission_status:
        | "pending"
        | "needs_info"
        | "verified"
        | "rejected"
        | "revoked"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_category: [
        "team_activity",
        "individual",
        "sprint_track",
        "bonus",
      ],
      activity_scope: ["team", "individual"],
      app_permission: [
        "submissions.verify",
        "submissions.revoke",
        "submissions.override_points",
        "rules.edit",
        "roles.manage",
        "export.run",
        "members.manage",
        "meetups.manage",
      ],
      app_role: ["member", "core", "lead"],
      sprint_track: ["code", "open_source", "build", "pitch"],
      submission_status: [
        "pending",
        "needs_info",
        "verified",
        "rejected",
        "revoked",
      ],
    },
  },
} as const
