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
      alerts: {
        Row: {
          affected_product: string | null
          created_at: string
          id: number
          location_sensor_idx: number
          location_shelf_idx: number
          status: string
        }
        Insert: {
          affected_product?: string | null
          created_at?: string
          id?: number
          location_sensor_idx: number
          location_shelf_idx: number
          status?: string
        }
        Update: {
          affected_product?: string | null
          created_at?: string
          id?: number
          location_sensor_idx?: number
          location_shelf_idx?: number
          status?: string
        }
        Relationships: []
      }
      article: {
        Row: {
          allergy_labels: string[] | null
          carbon_footprint: number | null
          category: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredient_name: string | null
          is_available: boolean | null
          is_biological: boolean | null
          name: string
          nutriscore: string | null
          nutrition_table: string | null
          sku: string
        }
        Insert: {
          allergy_labels?: string[] | null
          carbon_footprint?: number | null
          category?: string | null
          description?: string | null
          id: string
          image_url?: string | null
          ingredient_name?: string | null
          is_available?: boolean | null
          is_biological?: boolean | null
          name: string
          nutriscore?: string | null
          nutrition_table?: string | null
          sku: string
        }
        Update: {
          allergy_labels?: string[] | null
          carbon_footprint?: number | null
          category?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredient_name?: string | null
          is_available?: boolean | null
          is_biological?: boolean | null
          name?: string
          nutriscore?: string | null
          nutrition_table?: string | null
          sku?: string
        }
        Relationships: []
      }
      delivery: {
        Row: {
          customer: string
          delivery_id: string
          fc_id: string
          hub_id: string | null
          timeslot: string
          trip_id: string | null
        }
        Insert: {
          customer: string
          delivery_id: string
          fc_id: string
          hub_id?: string | null
          timeslot: string
          trip_id?: string | null
        }
        Update: {
          customer?: string
          delivery_id?: string
          fc_id?: string
          hub_id?: string | null
          timeslot?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_fc_id_fkey"
            columns: ["fc_id"]
            isOneToOne: false
            referencedRelation: "fc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hub"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_recipe: {
        Row: {
          delivery_id: string
          recipe_id: string
        }
        Insert: {
          delivery_id: string
          recipe_id: string
        }
        Update: {
          delivery_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_recipe_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "delivery"
            referencedColumns: ["delivery_id"]
          },
          {
            foreignKeyName: "delivery_recipe_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe"
            referencedColumns: ["id"]
          },
        ]
      }
      fc: {
        Row: {
          address: string
          country: string
          id: string
        }
        Insert: {
          address: string
          country: string
          id: string
        }
        Update: {
          address?: string
          country?: string
          id?: string
        }
        Relationships: []
      }
      hub: {
        Row: {
          address: string
          country: string
          id: string
        }
        Insert: {
          address: string
          country: string
          id: string
        }
        Update: {
          address?: string
          country?: string
          id?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          id: string
          location_floor: number
          location_sensor_idx: number
          location_shelf_idx: number
          time: string
          value: number
        }
        Insert: {
          id?: string
          location_floor: number
          location_sensor_idx: number
          location_shelf_idx: number
          time?: string
          value: number
        }
        Update: {
          id?: string
          location_floor?: number
          location_sensor_idx?: number
          location_shelf_idx?: number
          time?: string
          value?: number
        }
        Relationships: []
      }
      measurements_simulation: {
        Row: {
          created_at: string | null
          id: string
          location_floor: number
          location_sensor_idx: number
          location_shelf_idx: number
          time: string
          value: number
          value_humidity: number | null
          value_temperature: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_floor: number
          location_sensor_idx: number
          location_shelf_idx: number
          time?: string
          value: number
          value_humidity?: number | null
          value_temperature?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_floor?: number
          location_sensor_idx?: number
          location_shelf_idx?: number
          time?: string
          value?: number
          value_humidity?: number | null
          value_temperature?: number | null
        }
        Relationships: []
      }
      orderline: {
        Row: {
          delivery_id: string
          id: string
          quantity: number
          sku: string
        }
        Insert: {
          delivery_id: string
          id: string
          quantity: number
          sku: string
        }
        Update: {
          delivery_id?: string
          id?: string
          quantity?: number
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "orderline_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "delivery"
            referencedColumns: ["delivery_id"]
          },
        ]
      }
      recipe: {
        Row: {
          id: string
          ingredients: Json
          instructions: string[] | null
          name: string
          portion_quantity: number
        }
        Insert: {
          id: string
          ingredients: Json
          instructions?: string[] | null
          name: string
          portion_quantity: number
        }
        Update: {
          id?: string
          ingredients?: Json
          instructions?: string[] | null
          name?: string
          portion_quantity?: number
        }
        Relationships: []
      }
      sensors: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      stock: {
        Row: {
          fc_id: string
          id: string
          is_marked_imperfect: boolean | null
          last_delivery_timestamp: string | null
          quantity: number
          sku: string
          stock_location: string
        }
        Insert: {
          fc_id: string
          id?: string
          is_marked_imperfect?: boolean | null
          last_delivery_timestamp?: string | null
          quantity: number
          sku: string
          stock_location: string
        }
        Update: {
          fc_id?: string
          id?: string
          is_marked_imperfect?: boolean | null
          last_delivery_timestamp?: string | null
          quantity?: number
          sku?: string
          stock_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_fc_id_fkey"
            columns: ["fc_id"]
            isOneToOne: false
            referencedRelation: "fc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_stock_location_fkey"
            columns: ["stock_location"]
            isOneToOne: false
            referencedRelation: "stock_location"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_location: {
        Row: {
          created_at: string
          floor: number | null
          id: string
          shelf: string
          shelf_slot: number
        }
        Insert: {
          created_at?: string
          floor?: number | null
          id?: string
          shelf?: string
          shelf_slot: number
        }
        Update: {
          created_at?: string
          floor?: number | null
          id?: string
          shelf?: string
          shelf_slot?: number
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string
          id: string
          test: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          test?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          test?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          address: string
          country: string
          house_hold_size: number
          id: string
          name: string
        }
        Insert: {
          address: string
          country: string
          house_hold_size: number
          id: string
          name: string
        }
        Update: {
          address?: string
          country?: string
          house_hold_size?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_hourly_measurements: {
        Args: {
          _location_sensor_idx: number
          _location_shelf_idx: number
          _location_floor: number
        }
        Returns: {
          hour: string
          total_value: number
        }[]
      }
      get_latest_measurements: {
        Args: Record<PropertyKey, never> | { before_time: string }
        Returns: {
          location_floor: number
          location_sensor_idx: number
          location_shelf_idx: number
          created_at: string
          value: number
          value_humidity: number
          value_temperature: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
