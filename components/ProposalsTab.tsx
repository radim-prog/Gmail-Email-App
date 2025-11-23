import React, { useState } from 'react';
import { Check, X, BarChart2, Mail } from 'lucide-react';
import { Proposal } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ProposalsTabProps {
  proposals: Proposal[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ProposalsTab: React.FC<ProposalsTabProps> = ({ proposals, onApprove, onReject }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Vše hotovo!</h3>
        <p className="text-slate-500 mt-2">Momentálně nemáte žádné čekající návrhy pravidel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          🔔 Čekající návrhy
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">
            {proposals.length}
          </span>
        </h2>
      </div>

      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <div key={proposal.proposal_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg text-slate-900">{proposal.sender}</span>
                    <Badge variant="info">{proposal.semantic_type_czech}</Badge>
                    <Badge variant={proposal.confidence > 0.9 ? 'success' : 'warning'}>
                      {Math.round(proposal.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 mb-4">
                    Navrhovaná akce: <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{proposal.proposed_action_czech}</span>
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>Analyzováno {proposal.sample_count} vzorků emailů</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="primary" 
                      onClick={() => onApprove(proposal.proposal_id)}
                      icon={<Check className="w-4 h-4" />}
                    >
                      Schválit
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => onReject(proposal.proposal_id)}
                      icon={<X className="w-4 h-4" />}
                    >
                      Zamítnout
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setExpandedId(expandedId === proposal.proposal_id ? null : proposal.proposal_id)}
                      icon={<BarChart2 className="w-4 h-4" />}
                    >
                      {expandedId === proposal.proposal_id ? 'Skrýt vzorky' : 'Zobrazit vzorky'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Samples Expansion */}
              {expandedId === proposal.proposal_id && (
                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Vzorové předměty emailů:</h4>
                  <ul className="space-y-2">
                    {proposal.sample_subjects.map((subject, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400 shrink-0" />
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};