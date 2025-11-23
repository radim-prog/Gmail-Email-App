import React from 'react';
import { Play, Pause, Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Rule } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface RulesTabProps {
  rules: Rule[];
  onTogglePause: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateManual: () => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({ rules, onTogglePause, onDelete, onCreateManual }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">✅ Aktivní pravidla ({rules.length})</h2>
        <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />} onClick={onCreateManual}>
          Nové pravidlo
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.rule_id} className={`bg-white rounded-xl shadow-sm border ${rule.status === 'paused' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'} p-5 transition-all`}>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{rule.sender}</h3>
                  {rule.status === 'active' ? (
                    <Badge variant="success">Aktivní</Badge>
                  ) : (
                    <Badge variant="warning">Pozastaveno</Badge>
                  )}
                  {rule.is_granular && <Badge variant="info">Granulární</Badge>}
                </div>

                {rule.is_granular ? (
                  <div className="mt-3 space-y-2">
                    {rule.granular_rules?.map((gr, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 w-24">{gr.condition.semantic_type}</span>
                        <span className="text-slate-400">→</span>
                        <span className={`font-medium ${gr.action === 'delete' ? 'text-red-600' : 'text-slate-700'}`}>
                          {gr.action}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-slate-500">Typ:</span>
                    <span className="font-medium text-slate-700 capitalize">{rule.semantic_type}</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-slate-500">Akce:</span>
                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{rule.action}</span>
                  </div>
                )}
                
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span>Aplikováno: {rule.times_applied}x</span>
                  <span>Vytvořeno: {new Date(rule.created_at).toLocaleDateString('cs-CZ')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <button 
                  onClick={() => onTogglePause(rule.rule_id)}
                  className={`p-2 rounded-lg transition-colors ${rule.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                  title={rule.status === 'active' ? "Pozastavit" : "Obnovit"}
                >
                  {rule.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(rule.rule_id)}
                  className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {rules.length === 0 && (
            <div className="text-center py-10 text-slate-400">
                Žádná pravidla. Vytvořte nové nebo počkejte na návrhy.
            </div>
        )}
      </div>
    </div>
  );
};