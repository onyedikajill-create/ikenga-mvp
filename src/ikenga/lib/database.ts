export interface Database {
  public: {
    Tables: {
      engines: {
        Row: {
          id: string;
          name: string;
          path: string;
          description: string;
          category: string;
          status: string;
          api_key_env_var: string;
          api_key_placeholder: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          path: string;
          description: string;
          category: string;
          status?: string;
          api_key_env_var: string;
          api_key_placeholder: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["engines"]["Insert"]>;
        Relationships: [];
      };
      engine_versions: {
        Row: {
          id: string;
          engine_id: string;
          version: string;
          changelog: string;
          deployed_at: string;
          deployed_by: string;
          parent_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          engine_id: string;
          version: string;
          changelog: string;
          deployed_at?: string;
          deployed_by: string;
          parent_version?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["engine_versions"]["Insert"]>;
        Relationships: [];
      };
      engine_deployments: {
        Row: {
          id: string;
          engine_id: string;
          version: string;
          environment: string;
          status: string;
          requested_by: string;
          requested_at: string;
          approval_request_id: string | null;
          approved_by: string | null;
          approved_at: string | null;
          deployed_at: string | null;
          deployed_by: string | null;
          rollback_target_id: string | null;
          vercel_deployment_id: string | null;
          deployment_url: string | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          engine_id: string;
          version: string;
          environment: string;
          status?: string;
          requested_by: string;
          requested_at?: string;
          approval_request_id?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          deployed_at?: string | null;
          deployed_by?: string | null;
          rollback_target_id?: string | null;
          vercel_deployment_id?: string | null;
          deployment_url?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["engine_deployments"]["Insert"]>;
        Relationships: [];
      };
      engine_audit_logs: {
        Row: {
          audit_id: string;
          action: string;
          category: string;
          scope: string;
          scope_id: string | null;
          actor: string;
          actor_role: string;
          actor_tier: string;
          engine_id: string | null;
          target_id: string | null;
          ai_model: string | null;
          agent_id: string | null;
          outcome: string;
          payload: unknown;
          payload_hash: string | null;
          output_hash: string | null;
          previous_entry_hash: string | null;
          entry_hash: string;
          ip_address: string | null;
          session_id: string | null;
          timestamp: string;
        };
        Insert: {
          audit_id: string;
          action: string;
          category: string;
          scope: string;
          scope_id?: string | null;
          actor: string;
          actor_role: string;
          actor_tier: string;
          engine_id?: string | null;
          target_id?: string | null;
          ai_model?: string | null;
          agent_id?: string | null;
          outcome: string;
          payload?: unknown;
          payload_hash?: string | null;
          output_hash?: string | null;
          previous_entry_hash?: string | null;
          entry_hash: string;
          ip_address?: string | null;
          session_id?: string | null;
          timestamp?: string;
        };
        Update: Partial<Database["public"]["Tables"]["engine_audit_logs"]["Insert"]>;
        Relationships: [];
      };
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          source: string;
          status: string;
          metadata: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          status?: string;
          metadata?: unknown;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["waitlist_signups"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
}
