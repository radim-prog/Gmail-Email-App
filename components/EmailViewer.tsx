
import React, { useState } from 'react';
import { X, Sparkles, Mic, Forward, Archive, Trash2, Reply } from 'lucide-react';
import { InboxEmail } from '../types';
import { Button } from './ui/Button';
import { ForwardDialog } from './ForwardDialog';

interface EmailViewerProps {
  email: InboxEmail;
  onClose: () => void;
  onForward: (to: string[], message: string) => void;
  onAIResponse: () => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  onClose,
  onForward,
  onAIResponse
}) => {
  const [showForwardDialog, setShowForwardDialog] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {getInitials(email.from.name)}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">{email.from.name}</h2>
              <p className="text-sm text-slate-500">{email.from.email}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{email.subject}</h3>
          <p className="text-sm text-slate-500">{formatDate(email.date)}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          {email.body || email.snippet}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Co chceš udělat?</h4>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={onAIResponse}
          >
            🤖 AI odpověď
          </Button>

          <Button
            variant="secondary"
            icon={<Mic className="w-4 h-4" />}
            onClick={() => alert('Voice dictation - coming soon!')}
          >
            🎤 Diktovat
          </Button>

          <Button
            variant="secondary"
            icon={<Forward className="w-4 h-4" />}
            onClick={() => setShowForwardDialog(true)}
          >
            ➡️ Přeposlat
          </Button>

          <Button
            variant="ghost"
            icon={<Reply className="w-4 h-4" />}
            onClick={() => alert('Manual reply - coming soon!')}
          >
            ✏️ Odpovědět ručně
          </Button>

          <Button
            variant="ghost"
            icon={<Archive className="w-4 h-4" />}
            onClick={() => alert('Archive - coming soon!')}
          >
            📋 Archivovat
          </Button>

          <Button
            variant="ghost"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => confirm('Opravdu smazat?') && alert('Delete - coming soon!')}
          >
            🗑️ Smazat
          </Button>
        </div>
      </div>

      {/* Forward Dialog */}
      {showForwardDialog && (
        <ForwardDialog
          email={email}
          onClose={() => setShowForwardDialog(false)}
          onForward={onForward}
        />
      )}
    </div>
  );
};
