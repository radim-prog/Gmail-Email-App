
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, PieChart, Settings, Mail } from 'lucide-react';

import { Proposal, Rule, StatsData, ChatMessage, InboxEmail } from './types';
import { INITIAL_PROPOSALS, INITIAL_RULES, INITIAL_STATS, MOCK_INBOX_EMAILS } from './services/mockData';
import { parseUserCommand } from './services/geminiService';

import { InboxTab } from './components/InboxTab';
import { ProposalsTab } from './components/ProposalsTab';
import { RulesTab } from './components/RulesTab';
import { StatsTab } from './components/StatsTab';
import { ChatWidget } from './components/ChatWidget';

type Tab = 'inbox' | 'proposals' | 'rules' | 'stats' | 'settings';

export default function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  
  const [inboxEmails, setInboxEmails] = useState<InboxEmail[]>(MOCK_INBOX_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessingChat, setIsProcessingChat] = useState(false);

  // --- Handlers: Proposals ---
  const handleApproveProposal = (id: string) => {
    const proposal = proposals.find(p => p.proposal_id === id);
    if (!proposal) return;

    // Create new rule from proposal
    const newRule: Rule = {
      rule_id: `rule_${Date.now()}`,
      sender: proposal.sender,
      semantic_type: proposal.semantic_type,
      action: proposal.proposed_action,
      created_at: new Date().toISOString(),
      times_applied: 0,
      status: 'active',
      paused_until: null,
      created_via: 'learned',
      is_granular: false
    };

    setRules(prev => [newRule, ...prev]);
    setProposals(prev => prev.filter(p => p.proposal_id !== id));
    
    // Update stats
    setStats(prev => ({
        ...prev,
        active_rules: prev.active_rules + 1,
        pending_proposals: prev.pending_proposals - 1
    }));
  };

  const handleRejectProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.proposal_id !== id));
    setStats(prev => ({ ...prev, pending_proposals: prev.pending_proposals - 1 }));
  };

  // --- Handlers: Rules ---
  const handleTogglePause = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.rule_id === id) {
        return { ...r, status: r.status === 'active' ? 'paused' : 'active' };
      }
      return r;
    }));
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Opravdu smazat toto pravidlo?")) {
        setRules(prev => prev.filter(r => r.rule_id !== id));
        setStats(prev => ({ ...prev, active_rules: prev.active_rules - 1 }));
    }
  };

  const handleCreateManualRule = () => {
    alert("Funkce pro manuální vytvoření pravidla by zde otevřela modální okno.");
  };

  // --- Handlers: Inbox ---
  const handleSelectEmail = (email: InboxEmail) => {
    setSelectedEmail(email);
    console.log('Selected email:', email);
  };

  const handleForward = (emailId: string, to: string[], message: string) => {
    console.log('Forwarding email:', emailId, 'to:', to, 'message:', message);
    // TODO: API call pro forward
    alert(`Email přeposlán na: ${to.join(', ')}`);
  };

  const handleAIResponse = (emailId: string) => {
    console.log('Generate AI response for email:', emailId);
    // TODO: AI response generation
    alert('AI response - coming soon!');
  };

  // --- Chat Logic ---
  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsProcessingChat(true);

    // Call "AI"
    const response = await parseUserCommand(text);

    // Execute Logic based on intent
    let systemResponseText = response.response_text;

    if (response.intent === 'unblock_sender' && response.parameters?.sender) {
        const sender = response.parameters.sender;
        const initialCount = rules.length;
        // Filter out rules matching sender (fuzzy match for demo)
        const newRules = rules.filter(r => !r.sender.includes(sender));
        if (newRules.length < initialCount) {
            setRules(newRules);
            setStats(prev => ({ ...prev, active_rules: newRules.length }));
        }
    }
    else if (response.intent === 'pause_rule') {
        setRules(prev => prev.map(r => ({ ...r, status: 'paused', paused_until: '2024-12-12T00:00:00Z' })));
    }
    // (Other intents like granular_rule would be implemented here to mutate state)

    // Add AI response
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: systemResponseText,
      timestamp: new Date(),
      intent: response.intent
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setIsProcessingChat(false);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gmail AI Assistant</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Automated by Gemini</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              <NavButton 
                active={activeTab === 'inbox'} 
                onClick={() => setActiveTab('inbox')} 
                icon={<Mail className="w-4 h-4"/>}
              >
                Inbox
              </NavButton>
              <NavButton active={activeTab === 'proposals'} onClick={() => setActiveTab('proposals')} icon={<List className="w-4 h-4"/>}>Návrhy</NavButton>
              <NavButton active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} icon={<LayoutDashboard className="w-4 h-4"/>}>Pravidla</NavButton>
              <NavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<PieChart className="w-4 h-4"/>}>Statistiky</NavButton>
              <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="w-4 h-4"/>}>Nastavení</NavButton>
            </nav>
            
            <div className="flex items-center md:hidden">
                {/* Mobile Menu Placeholder - keeping simple for this output */}
                 <span className="text-xs text-slate-400">v1.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inbox' && (
          <InboxTab
            emails={inboxEmails}
            onSelectEmail={handleSelectEmail}
            onForward={handleForward}
            onAIResponse={handleAIResponse}
          />
        )}

        {activeTab === 'proposals' && (
          <ProposalsTab 
            proposals={proposals} 
            onApprove={handleApproveProposal} 
            onReject={handleRejectProposal} 
          />
        )}
        
        {activeTab === 'rules' && (
          <RulesTab 
            rules={rules} 
            onTogglePause={handleTogglePause}
            onDelete={handleDeleteRule}
            onCreateManual={handleCreateManualRule}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab stats={stats} />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold">Nastavení</h2>
              <p className="text-slate-500">
                  Připojení k Gmail účtu je <span className="text-green-600 font-medium">aktivní</span>.
                  <br/>
                  Konfigurace bude dostupná v další verzi.
              </p>
              <div className="pt-4 border-t border-slate-100 mt-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">API Debug</div>
                   <p className="text-xs text-slate-400">Gemini SDK Ready</p>
              </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40">
          <MobileNavButton 
            active={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')} 
            icon={<Mail size={20}/>} 
            label="Inbox" 
          />
          <MobileNavButton active={activeTab === 'proposals'} onClick={() => setActiveTab('proposals')} icon={<List size={20}/>} label="Návrhy" />
          <MobileNavButton active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} icon={<LayoutDashboard size={20}/>} label="Pravidla" />
          <MobileNavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<PieChart size={20}/>} label="Stats" />
          <MobileNavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Setup" />
      </div>

      {/* Sticky Chat Widget */}
      <ChatWidget 
        messages={chatMessages} 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessingChat}
      />
    </div>
  );
}

// Helper Components for Nav
const NavButton = ({ active, children, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
      active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    {icon}
    {children}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full py-1 ${active ? 'text-blue-600' : 'text-slate-500'}`}
    >
        {icon}
        <span className="text-[10px] mt-1">{label}</span>
    </button>
);
