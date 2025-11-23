
import React, { useState } from 'react';
import { Mail, Sparkles, Mic } from 'lucide-react';
import { InboxEmail } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { EmailViewer } from './EmailViewer';

interface InboxTabProps {
  emails: InboxEmail[];
  onSelectEmail: (email: InboxEmail) => void;
  onForward: (emailId: string, to: string[], message: string) => void;
  onAIResponse: (emailId: string) => void;
}

export const InboxTab: React.FC<InboxTabProps> = ({
  emails,
  onSelectEmail,
  onForward,
  onAIResponse
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_reply' | 'important'>('all');
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    if (filter === 'needs_reply') {
      return email.ai_recommendation?.action === 'respond';
    }
    if (filter === 'important') {
      return email.ai_recommendation?.urgency === 'high';
    }
    return true;
  });

  const handleEmailClick = (email: InboxEmail) => {
    setSelectedEmail(email);
    onSelectEmail(email);
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Dnes';
    if (diffDays === 1) return 'Včera';
    if (diffDays < 7) return `Před ${diffDays} dny`;
    return `Před ${Math.floor(diffDays / 7)} týdny`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (selectedEmail) {
    return (
      <EmailViewer
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onForward={(to, message) => onForward(selectedEmail.email_id, to, message)}
        onAIResponse={() => onAIResponse(selectedEmail.email_id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          📬 Inbox ({filteredEmails.length})
        </h2>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Všechny
          </Button>
          <Button
            variant={filter === 'needs_reply' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('needs_reply')}
          >
            Vyžadují odpověď
          </Button>
          <Button
            variant={filter === 'important' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('important')}
          >
            Důležité
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="grid gap-4">
        {filteredEmails.map(email => (
          <div
            key={email.email_id}
            onClick={() => handleEmailClick(email)}
            className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer ${
              !email.is_read ? 'border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                {getInitials(email.from.name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{email.from.name}</h3>
                    {!email.is_read && <Badge variant="info">Nový</Badge>}
                    {email.has_attachment && <span>📎</span>}
                  </div>
                  <span className="text-sm text-slate-500">{formatRelativeTime(email.date)}</span>
                </div>

                <p className="font-medium text-slate-800 mb-1">{email.subject}</p>
                <p className="text-sm text-slate-600 truncate">{email.snippet}</p>

                {/* AI Recommendation */}
                {email.ai_recommendation && (
                  <div className="mt-3 flex items-center gap-2">
                    {email.ai_recommendation.action === 'respond' && (
                      <>
                        <Badge variant="warning">
                          🤖 Doporučuji odpovědět ({email.ai_recommendation.urgency})
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="primary" icon={<Sparkles className="w-3 h-3" />}>
                            AI odpověď
                          </Button>
                          <Button size="sm" variant="secondary" icon={<Mic className="w-3 h-3" />}>
                            Diktovat
                          </Button>
                        </div>
                      </>
                    )}

                    {email.ai_recommendation.action === 'quick_reply' && email.ai_recommendation.quick_replies && (
                      <div className="flex gap-2">
                        {email.ai_recommendation.quick_replies.map(reply => (
                          <Button key={reply} size="sm" variant="ghost">
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    {email.ai_recommendation.action === 'auto_delete' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">
                          🤖 Pravidlo: {email.ai_recommendation.reason}
                        </Badge>
                        <Button size="sm" variant="primary">✅ Potvrdit</Button>
                        <Button size="sm" variant="ghost">✏️ Upravit</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredEmails.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            Žádné emaily
          </div>
        )}
      </div>
    </div>
  );
};
