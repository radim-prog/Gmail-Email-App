import { Proposal, Rule, StatsData } from '../types';

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    proposal_id: "prop_123",
    sender: "billing@company.com",
    sender_domain: "company.com",
    semantic_type: "invoice",
    semantic_type_czech: "Faktura",
    proposed_action: "archive",
    proposed_action_czech: "Archivovat",
    confidence: 0.87,
    sample_count: 12,
    sample_subjects: [
      "Invoice #12345 - Due Oct 15",
      "Invoice #12346 - Due Oct 22",
      "Invoice #12347 - Due Oct 29"
    ],
    created_at: "2024-11-23T10:30:00Z",
    status: "pending"
  },
  {
    proposal_id: "prop_124",
    sender: "notifications@github.com",
    sender_domain: "github.com",
    semantic_type: "notification",
    semantic_type_czech: "Notifikace",
    proposed_action: "delete",
    proposed_action_czech: "Smazat",
    confidence: 0.92,
    sample_count: 15,
    sample_subjects: [
      "[Deploy] Success: production-api",
      "[Deploy] Success: frontend-web",
      "[Deploy] Success: worker-node"
    ],
    created_at: "2024-11-24T08:15:00Z",
    status: "pending"
  },
  {
    proposal_id: "prop_125",
    sender: "newsletter@shop.cz",
    sender_domain: "shop.cz",
    semantic_type: "marketing",
    semantic_type_czech: "Marketing",
    proposed_action: "delete",
    proposed_action_czech: "Smazat",
    confidence: 0.78,
    sample_count: 8,
    sample_subjects: [
      "🔥 Černý pátek začíná!",
      "Poslední šance na nákup",
      "Váš košík čeká"
    ],
    created_at: "2024-11-24T12:00:00Z",
    status: "pending"
  }
];

export const INITIAL_RULES: Rule[] = [
  {
    rule_id: "rule_456",
    sender: "billing@old-service.com",
    semantic_type: "invoice",
    action: "archive",
    created_at: "2024-10-15T00:00:00Z",
    times_applied: 23,
    status: "active",
    paused_until: null,
    created_via: "learned",
    is_granular: false
  },
  {
    rule_id: "rule_457",
    sender: "news@daily.com",
    semantic_type: "newsletter",
    action: "delete",
    created_at: "2024-10-20T00:00:00Z",
    times_applied: 45,
    status: "paused",
    paused_until: "2024-12-01T00:00:00Z",
    created_via: "learned",
    is_granular: false
  },
  {
    rule_id: "rule_789",
    sender: "csob.cz",
    is_granular: true,
    created_at: "2024-11-01T00:00:00Z",
    created_via: "conversational",
    times_applied: 8,
    status: "active",
    paused_until: null,
    granular_rules: [
      {
        condition: { semantic_type: "marketing" },
        action: "delete",
        priority: 100
      },
      {
        condition: { semantic_type: "invoice" },
        action: "keep",
        priority: 110
      }
    ]
  }
];

export const INITIAL_STATS: StatsData = {
  active_rules: 5,
  pending_proposals: 3,
  patterns_count: 12,
  emails_processed: 1247,
  actions_automated: 456,
  time_saved_hours: 8.2,
  top_patterns: [
    { sender: "billing@company.com", type: "Invoice", count: 127 },
    { sender: "github.com", type: "Notifications", count: 89 },
    { sender: "newsletter@news.com", type: "Newsletter", count: 67 },
    { sender: "updates@service.com", type: "Updates", count: 45 },
    { sender: "ads@marketing.com", type: "Marketing", count: 34 }
  ],
  activity_history: [
    { name: 'Týden 1', value: 45 },
    { name: 'Týden 2', value: 52 },
    { name: 'Týden 3', value: 38 },
    { name: 'Týden 4', value: 41 },
  ]
};
