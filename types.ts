
export type ActionType = 'archive' | 'delete' | 'keep' | 'mark_important' | 'label';
export type SemanticType = 'invoice' | 'marketing' | 'newsletter' | 'notification' | 'update' | 'security';
export type RuleStatus = 'active' | 'paused';
export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface Proposal {
  proposal_id: string;
  sender: string;
  sender_domain: string;
  semantic_type: SemanticType;
  semantic_type_czech: string;
  proposed_action: ActionType;
  proposed_action_czech: string;
  confidence: number;
  sample_count: number;
  sample_subjects: string[];
  created_at: string;
  status: ProposalStatus;
}

export interface GranularCondition {
  condition: { semantic_type: SemanticType };
  action: ActionType;
  priority: number;
}

export interface Rule {
  rule_id: string;
  sender: string; // email or domain
  semantic_type?: SemanticType;
  action?: ActionType;
  created_at: string;
  times_applied: number;
  status: RuleStatus;
  paused_until: string | null;
  created_via: 'learned' | 'conversational' | 'manual';
  is_granular: boolean;
  granular_rules?: GranularCondition[];
}

export interface StatsData {
  active_rules: number;
  pending_proposals: number;
  patterns_count: number;
  emails_processed: number;
  actions_automated: number;
  time_saved_hours: number;
  top_patterns: { sender: string; type: string; count: number }[];
  activity_history: { name: string; value: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  intent?: string; // Debug info
}

export interface CommandResponse {
  intent: 'unblock_sender' | 'granular_rule' | 'list_rules' | 'pause_rule' | 'delete_rule' | 'unknown';
  parameters?: Record<string, any>;
  response_text: string;
}

// Inbox Email
export interface InboxEmail {
  email_id: string;
  from: {
    email: string;
    name: string;
  };
  subject: string;
  snippet: string;
  body?: string;
  date: string;
  is_read: boolean;
  has_attachment: boolean;
  labels: string[];
  ai_recommendation?: {
    action: 'respond' | 'quick_reply' | 'auto_delete';
    urgency?: 'low' | 'medium' | 'high';
    reason?: string;
    quick_replies?: string[];
    rule_id?: string;
  };
}

// Contact
export interface Contact {
  contact_id: string;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  department?: string;
  position?: string;
  type: 'internal' | 'external' | 'client' | 'vendor';
  tags: string[];
  email_count: number;
  last_contact: string;
  forward_count: number;
  reply_count: number;
  is_favorite: boolean;
  favorite_rank: number;
  created_at: string;
  updated_at: string;
}
