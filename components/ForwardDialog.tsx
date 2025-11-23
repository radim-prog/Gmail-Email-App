
import React, { useState } from 'react';
import { X, Search, Forward } from 'lucide-react';
import { InboxEmail, Contact } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { MOCK_CONTACTS } from '../services/mockContacts';

interface ForwardDialogProps {
  email: InboxEmail;
  onClose: () => void;
  onForward: (to: string[], message: string) => void;
}

export const ForwardDialog: React.FC<ForwardDialogProps> = ({ email, onClose, onForward }) => {
  const [step, setStep] = useState<'select' | 'compose'>('select');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Utility funkce
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const searchContacts = (query: string): Contact[] => {
    const q = query.toLowerCase();
    return MOCK_CONTACTS.filter(contact =>
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.first_name?.toLowerCase().includes(q) ||
      contact.last_name?.toLowerCase().includes(q) ||
      contact.department?.toLowerCase().includes(q)
    );
  };

  const getTopContacts = (): Contact[] => {
    return MOCK_CONTACTS
      .filter(c => c.is_favorite)
      .sort((a, b) => a.favorite_rank - b.favorite_rank)
      .slice(0, 5);
  };

  const topContacts = getTopContacts();
  const searchResults = searchQuery.length >= 2 ? searchContacts(searchQuery) : [];

  const handleSelectContact = (contact: Contact) => {
    if (!selectedContacts.find(c => c.email === contact.email)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
    setSearchQuery('');
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(c => c.contact_id !== contactId));
  };

  const handleForward = () => {
    onForward(
      selectedContacts.map(c => c.email),
      message
    );
    onClose();
  };

  const aiSuggestions = [
    "Pro vaše info",
    "Prosím zpracuj tento dokument",
    "K tvému vyjádření",
    "FYI - for your information"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">➡️ Přeposlat email</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              {/* Quick Forward */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  ⚡ Quick Forward (nejčastější):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topContacts.map(contact => (
                    <button
                      key={contact.contact_id}
                      onClick={() => {
                        handleSelectContact(contact);
                        setStep('compose');
                      }}
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                        {getInitials(contact.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{contact.name}</div>
                        <div className="text-xs text-slate-500 truncate">{contact.email}</div>
                        {contact.department && (
                          <div className="text-xs text-slate-400">{contact.department}</div>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">↗️ {contact.forward_count}x</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-500">Nebo</span>
                </div>
              </div>

              {/* Contact Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hledat kontakt nebo zadat email..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-sm text-slate-600">Výsledky ({searchResults.length}):</p>
                    {searchResults.map(contact => (
                      <button
                        key={contact.contact_id}
                        onClick={() => handleSelectContact(contact)}
                        className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                          {getInitials(contact.name)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{contact.name}</div>
                          <div className="text-sm text-slate-500">{contact.email}</div>
                          {contact.department && (
                            <div className="text-xs text-slate-400">{contact.department}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-slate-600 mb-2">Žádný kontakt nenalezen</p>
                    {isValidEmail(searchQuery) && (
                      <Button
                        size="sm"
                        onClick={() => {
                          handleSelectContact({
                            contact_id: 'new',
                            name: searchQuery,
                            email: searchQuery,
                            type: 'external',
                            tags: [],
                            email_count: 0,
                            forward_count: 0,
                            reply_count: 0,
                            is_favorite: false,
                            favorite_rank: 0,
                            last_contact: new Date().toISOString(),
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          });
                        }}
                      >
                        Přeposlat na: {searchQuery}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Contacts */}
              {selectedContacts.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    Vybráno ({selectedContacts.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedContacts.map(contact => (
                      <div
                        key={contact.contact_id}
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {contact.name}
                        <button
                          onClick={() => handleRemoveContact(contact.contact_id)}
                          className="hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="mt-3"
                    onClick={() => setStep('compose')}
                  >
                    Pokračovat ({selectedContacts.length})
                  </Button>
                </div>
              )}
            </>
          )}

          {step === 'compose' && (
            <>
              {/* Recipients */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">➡️ Přeposlat na:</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedContacts.map(contact => (
                    <div
                      key={contact.contact_id}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {contact.name} ({contact.email})
                      <button
                        onClick={() => handleRemoveContact(contact.contact_id)}
                        className="hover:text-blue-900"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('select')}
                >
                  ➕ Přidat dalšího příjemce
                </Button>
              </div>

              {/* Message */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  💬 Přidat vlastní zprávu (volitelné):
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ahoj,\n\npřeposílám ti tento email...\n\nDíky,"
                  rows={6}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* AI Suggestions */}
                <div className="mt-2">
                  <p className="text-xs text-slate-600 mb-2">🤖 AI návrhy:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
                      >
                        💬 "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep('select')}
                >
                  ← Zpět
                </Button>
                <Button
                  variant="primary"
                  icon={<Forward className="w-4 h-4" />}
                  onClick={handleForward}
                >
                  ✅ Přeposlat ({selectedContacts.length})
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
