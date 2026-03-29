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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audiences: {
        Row: {
          age_range: string | null
          behavior: string | null
          business_id: string
          created_at: string
          description: string | null
          id: string
          interests: string | null
          location: string | null
          name: string
          networks: string[]
        }
        Insert: {
          age_range?: string | null
          behavior?: string | null
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          interests?: string | null
          location?: string | null
          name: string
          networks?: string[]
        }
        Update: {
          age_range?: string | null
          behavior?: string | null
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          interests?: string | null
          location?: string | null
          name?: string
          networks?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "audiences_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          colors: string | null
          created_at: string
          description: string
          id: string
          industry: string
          logo_url: string | null
          name: string
          social_networks: string[]
          typography: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          colors?: string | null
          created_at?: string
          description: string
          id?: string
          industry: string
          logo_url?: string | null
          name: string
          social_networks?: string[]
          typography?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          colors?: string | null
          created_at?: string
          description?: string
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          social_networks?: string[]
          typography?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_plan_audiences: {
        Row: {
          audience_id: string
          plan_id: string
        }
        Insert: {
          audience_id: string
          plan_id: string
        }
        Update: {
          audience_id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_plan_audiences_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_plan_audiences_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "content_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      content_plan_products: {
        Row: {
          plan_id: string
          product_id: string
        }
        Insert: {
          plan_id: string
          product_id: string
        }
        Update: {
          plan_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_plan_products_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "content_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_plan_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      content_plans: {
        Row: {
          business_id: string
          created_at: string
          id: string
          objective: string | null
          period_end: string | null
          period_start: string | null
          recommended_actions: string[]
          status: string
          strategy_summary: string | null
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          objective?: string | null
          period_end?: string | null
          period_start?: string | null
          recommended_actions?: string[]
          status?: string
          strategy_summary?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          objective?: string | null
          period_end?: string | null
          period_start?: string | null
          recommended_actions?: string[]
          status?: string
          strategy_summary?: string | null
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_posts: {
        Row: {
          copy: string | null
          created_at: string
          format: string | null
          id: string
          image_suggestion: string | null
          network: string | null
          plan_id: string
          scheduled_date: string | null
        }
        Insert: {
          copy?: string | null
          created_at?: string
          format?: string | null
          id?: string
          image_suggestion?: string | null
          network?: string | null
          plan_id: string
          scheduled_date?: string | null
        }
        Update: {
          copy?: string | null
          created_at?: string
          format?: string | null
          id?: string
          image_suggestion?: string | null
          network?: string | null
          plan_id?: string
          scheduled_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_posts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "content_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          differentiator: string | null
          id: string
          name: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          differentiator?: string | null
          id?: string
          name: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          differentiator?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      quick_generations: {
        Row: {
          audience_name: string | null
          business_id: string
          copy: string | null
          created_at: string
          detail: string | null
          format: string | null
          id: string
          image_suggestion: string | null
          product_id: string | null
        }
        Insert: {
          audience_name?: string | null
          business_id: string
          copy?: string | null
          created_at?: string
          detail?: string | null
          format?: string | null
          id?: string
          image_suggestion?: string | null
          product_id?: string | null
        }
        Update: {
          audience_name?: string | null
          business_id?: string
          copy?: string | null
          created_at?: string
          detail?: string | null
          format?: string | null
          id?: string
          image_suggestion?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_generations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_generations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
