
import React, { useState } from 'react';
import { Mail, Sparkles, Mic, Trash2, Forward, AlertTriangle, SkipForward, X } from 'lucide-react';
import { InboxEmail } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { EmailViewer } from './EmailViewer';

interface InboxTabProps {
  emails: InboxEmail[];
  onSelectEmail: (email: InboxEmail) => void;
  onForward: (emailId: string, to: string[], message: string) => void;
  onAIResponse: (emailId: string) => void;
  onConfirmDelete: (emailId: string) => void;
  onCancelDelete: (emailId: string, ruleId?: string) => void;
  onSkipEmail: (emailId: string) => void;
}

export const InboxTab: React.FC<InboxTabProps> = ({
  emails,
  onSelectEmail,
  onForward,
  onAIResponse,
  onConfirmDelete,
  onCancelDelete,
  onSkipEmail
}) => {
  const [filter, setFilter] = useState<'attention' | 'delete' | 'respond' | 'all'>('attention');
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    if (filter === 'attention') {
      return email.ai_recommendation?.urgency === 'high' || email.ai_recommendation?.action === 'respond';
    }
    if (filter === 'delete') {
      return email.ai_recommendation?.action === 'auto_delete';
    }
    if (filter === 'respond') {
      return email.ai_recommendation?.action === 'respond';
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

  // --- Render Functions for different card types ---

  const renderAutoDeleteCard = (email: InboxEmail) => (
    <div key={email.email_id} className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {getInitials(email.from.name)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{email.from.name}</h3>
                        <p className="text-sm text-slate-500">{email.subject}</p>
                    </div>
                </div>
                <span className="text-sm text-slate-400">{formatRelativeTime(email.date)}</span>
            </div>

            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-700">🤖 AI chce smazat</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Důvod: {email.ai_recommendation?.reason || 'Na základě vašich pravidel'}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onConfirmDelete(email.email_id); }}>
                        ✅ Potvrdit smazání
                    </Button>
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleEmailClick(email); }}>
                        📧 Chci odpovědět
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onCancelDelete(email.email_id, email.ai_recommendation?.rule_id); }}>
                        ❌ Nechat v inboxu
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderRespondCard = (email: InboxEmail) => (
    <div key={email.email_id} onClick={() => handleEmailClick(email)} className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
        {email.ai_recommendation?.urgency === 'high' && (
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        )}
        
        <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${email.ai_recommendation?.urgency === 'high' ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                {getInitials(email.from.name)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                     <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{email.from.name}</h3>
                        {email.ai_recommendation?.urgency === 'high' && (
                             <Badge variant="error">URGENTNÍ</Badge>
                        )}
                     </div>
                     <span className="text-sm text-slate-500">{formatRelativeTime(email.date)}</span>
                </div>
                
                <p className="font-medium text-slate-800">{email.subject}</p>
                <p className="text-sm text-slate-600 truncate mb-3">{email.snippet}</p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-sm text-blue-800 font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>Doporučuji odpovědět ({email.ai_recommendation?.urgency})</span>
                    </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="primary" size="sm" icon={<Sparkles className="w-3 h-3"/>} onClick={(e) => { e.stopPropagation(); onAIResponse(email.email_id); }}>
                        AI odpověď
                    </Button>
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleEmailClick(email); }}>
                        ✏️ Napsat ručně
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSkipEmail(email.email_id); }}>
                        ⏭️ Přeskočit
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderQuickReplyCard = (email: InboxEmail) => (
      <div key={email.email_id} onClick={() => handleEmailClick(email)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shrink-0">
                  {getInitials(email.from.name)}
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900">{email.from.name}</h3>
                      <span className="text-sm text-slate-500">{formatRelativeTime(email.date)}</span>
                  </div>
                  <p className="font-medium text-slate-800">{email.subject}</p>
                  <p className="text-sm text-slate-600 truncate mb-3">{email.snippet}</p>
                  
                  <div className="mt-2">
                       <p className="text-xs text-slate-500 mb-2 font-medium">Rychlá odpověď:</p>
                       <div className="flex flex-wrap gap-2">
                           {email.ai_recommendation?.quick_replies?.map((reply, i) => (
                               <Button key={i} variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert(`Odesláno: ${reply}`); }}>
                                   {reply}
                               </Button>
                           ))}
                       </div>
                  </div>
              </div>
          </div>
      </div>
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          🤖 AI Asistent
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">
            {filteredEmails.length}
          </span>
        </h2>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={filter === 'attention' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('attention')}
          >
            🔴 Vyžadují pozornost
          </Button>
          <Button
            variant={filter === 'delete' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('delete')}
          >
            🗑️ AI chce smazat
          </Button>
          <Button
            variant={filter === 'respond' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('respond')}
          >
            📧 AI chce odpovědět
          </Button>
           <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Všechny
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="grid gap-4">
        {filteredEmails.map(email => {
            if (email.ai_recommendation?.action === 'auto_delete') {
                return renderAutoDeleteCard(email);
            }
            if (email.ai_recommendation?.action === 'quick_reply') {
                return renderQuickReplyCard(email);
            }
            // Default respond/generic card
            return renderRespondCard(email);
        })}

        {filteredEmails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Vše hotovo!</h3>
            <p className="text-slate-500 mt-1">V této kategorii nemáte žádné emaily ke zpracování.</p>
          </div>
        )}
      </div>
    </div>
  );
};
