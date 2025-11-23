import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsData } from '../types';

interface StatsTabProps {
  stats: StatsData;
}

export const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Zpracováno emailů</div>
          <div className="text-2xl font-bold text-slate-900">{stats.emails_processed.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Automatizované akce</div>
          <div className="text-2xl font-bold text-blue-600">{stats.actions_automated}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Ušetřený čas (h)</div>
          <div className="text-2xl font-bold text-green-600">{stats.time_saved_hours}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Aktivní pravidla</div>
          <div className="text-2xl font-bold text-purple-600">{stats.active_rules}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Aktivita (posledních 30 dní)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activity_history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#4285F4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Patterns */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Patterns</h3>
          <div className="space-y-4">
            {stats.top_patterns.map((pattern, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">{pattern.sender}</div>
                    <div className="text-xs text-slate-500">{pattern.type}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">{pattern.count}x</div>
                  <div className="text-xs text-slate-400">akcí</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};