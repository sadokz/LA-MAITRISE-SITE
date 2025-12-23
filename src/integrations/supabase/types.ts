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
      app_colors: {
        Row: {
          created_at: string
          id: number
          primary_color_hex: string
          secondary_color_hex: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          primary_color_hex?: string
          secondary_color_hex?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          primary_color_hex?: string
          secondary_color_hex?: string
          updated_at?: string
        }
        Relationships: []
      }
      competences: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image_file: string | null
          image_mode: string
          image_url: string | null
          long_description: string | null
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          long_description?: string | null
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          long_description?: string | null
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      competences_page_settings: {
        Row: {
          created_at: string
          id: number
          media_file: string | null
          media_type: string
          media_url: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_coordinates: {
        Row: {
          created_at: string
          id: string
          label: string | null
          position: number
          type: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          position?: number
          type: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          position?: number
          type?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_texts: {
        Row: {
          content: string
          created_at: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      domaines: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image_file: string | null
          image_mode: string
          image_url: string | null
          long_description: string | null
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          long_description?: string | null
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          long_description?: string | null
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      domains_page_settings: {
        Row: {
          created_at: string
          id: number
          media_file: string | null
          media_type: string
          media_url: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      founder: {
        Row: {
          bio_html: string
          created_at: string
          experience_text_1: string | null
          experience_text_2: string | null
          experience_text_3: string | null
          experience_text_4: string | null
          founder_since: number
          founder_since_line: string
          id: number
          name: string
          photo_path: string | null
          quote: string | null
          since_line: string
          since_year: number
          title: string
          updated_at: string
          value_1_description: string | null
          value_1_title: string | null
          value_2_description: string | null
          value_2_title: string | null
          value_3_description: string | null
          value_3_title: string | null
          values_title: string | null
        }
        Insert: {
          bio_html?: string
          created_at?: string
          experience_text_1?: string | null
          experience_text_2?: string | null
          experience_text_3?: string | null
          experience_text_4?: string | null
          founder_since?: number
          founder_since_line?: string
          id?: number
          name?: string
          photo_path?: string | null
          quote?: string | null
          since_line?: string
          since_year?: number
          title?: string
          updated_at?: string
          value_1_description?: string | null
          value_1_title?: string | null
          value_2_description?: string | null
          value_2_title?: string | null
          value_3_description?: string | null
          value_3_title?: string | null
          values_title?: string | null
        }
        Update: {
          bio_html?: string
          created_at?: string
          experience_text_1?: string | null
          experience_text_2?: string | null
          experience_text_3?: string | null
          experience_text_4?: string | null
          founder_since?: number
          founder_since_line?: string
          id?: number
          name?: string
          photo_path?: string | null
          quote?: string | null
          since_line?: string
          since_year?: number
          title?: string
          updated_at?: string
          value_1_description?: string | null
          value_1_title?: string | null
          value_2_description?: string | null
          value_2_title?: string | null
          value_3_description?: string | null
          value_3_title?: string | null
          values_title?: string | null
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          created_at: string
          hero_media_file: string | null
          hero_media_type: string
          hero_media_url: string | null
          hero_source_type: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_media_file?: string | null
          hero_media_type?: string
          hero_media_url?: string | null
          hero_source_type?: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_media_file?: string | null
          hero_media_type?: string
          hero_media_url?: string | null
          hero_source_type?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      realisation_images: {
        Row: {
          created_at: string
          id: string
          image_file: string | null
          image_mode: string
          image_url: string | null
          position: number
          realisation_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          position?: number
          realisation_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          position?: number
          realisation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "realisation_images_realisation_id_fkey"
            columns: ["realisation_id"]
            isOneToOne: false
            referencedRelation: "realisations"
            referencedColumns: ["id"]
          },
        ]
      }
      realisations: {
        Row: {
          category: string
          created_at: string
          date_text: string | null
          description: string
          emplacement: string | null
          id: string
          image_file: string | null
          image_mode: string
          image_url: string | null
          is_featured: boolean
          is_visible: boolean
          long_description: string | null
          position: number
          reference: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date_text?: string | null
          description: string
          emplacement?: string | null
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          long_description?: string | null
          position?: number
          reference?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date_text?: string | null
          description?: string
          emplacement?: string | null
          id?: string
          image_file?: string | null
          image_mode?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          long_description?: string | null
          position?: number
          reference?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      realisations_page_settings: {
        Row: {
          created_at: string
          id: number
          media_file: string | null
          media_type: string
          media_url: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          media_file?: string | null
          media_type?: string
          media_url?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_visibility: {
        Row: {
          about: boolean
          chatbot_visible: boolean
          contact: boolean
          created_at: string
          domains: boolean
          founder: boolean
          home: boolean
          id: number
          projects: boolean
          skills: boolean
          updated_at: string
        }
        Insert: {
          about?: boolean
          chatbot_visible?: boolean
          contact?: boolean
          created_at?: string
          domains?: boolean
          founder?: boolean
          home?: boolean
          id?: number
          projects?: boolean
          skills?: boolean
          updated_at?: string
        }
        Update: {
          about?: boolean
          chatbot_visible?: boolean
          contact?: boolean
          created_at?: string
          domains?: boolean
          founder?: boolean
          home?: boolean
          id?: number
          projects?: boolean
          skills?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      site_texts: {
        Row: {
          content: string
          created_at: string
          id: string
          key: string
          page: string
          section: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          key: string
          page: string
          section: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          key?: string
          page?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
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