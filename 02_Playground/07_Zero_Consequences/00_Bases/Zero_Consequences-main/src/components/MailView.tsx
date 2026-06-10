import { useState } from "react";
import { GmailMessage } from "../types";
import { Mail, MailOpen, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { translations } from "../lib/translations";

interface MailViewProps {
  messages: GmailMessage[];
  onMarkRead: (id: string) => void;
  searchQuery: string;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function MailView({
  messages,
  onMarkRead,
  searchQuery,
  language = 'es',
  themeMode = 'craft'
}: MailViewProps) {
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [activeMessage, setActiveMessage] = useState<GmailMessage | null>(null);

  const t = translations[language].mail;
  const isLight = themeMode === 'craft';

  // Search keyword filtering + read-unread toggling
  const filteredMails = messages.filter(mail => {
    const matchesSearch = searchQuery
      ? mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesUnread = filterUnreadOnly ? mail.unread : true;
    
    return matchesSearch && matchesUnread;
  });

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6">
      
      {/* Inbox Thread List Table Side */}
      <div className="flex-grow flex flex-col gap-4">
        
        {/* Toggle options bar */}
        <div className={`flex justify-between items-center pb-4 border-b ${
          isLight ? 'border-zinc-200' : 'border-[#1E2435]'
        }`}>
          <h3 className={`font-semibold flex items-center gap-1.5 ${
            isLight ? 'text-zinc-900 font-sans' : 'font-mono text-xs text-[#7A839E] uppercase tracking-wider'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-zinc-700' : 'text-neon-magenta'}`} /> {t.transmissions}
          </h3>
          
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`font-mono text-[10px] px-2.5 py-1.5 border rounded-full transition-colors cursor-pointer ${
              filterUnreadOnly 
                ? isLight 
                  ? "border-amber-600 text-amber-700 bg-amber-50"
                  : "border-[#FFB400] text-[#FFB400] bg-[#FFB400]/5" 
                : isLight
                  ? "border-zinc-200 text-zinc-600 bg-white hover:bg-zinc-50"
                  : "border-[#1E2435] text-[#7A839E] hover:text-white"
            }`}
          >
            {filterUnreadOnly ? t.show_all : t.filter_unread}
          </button>
        </div>

        {/* List table */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredMails.length === 0 ? (
            <div className={`text-center py-16 border rounded-[2rem] ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#0a0e17] border-[#1E2435]'
            }`}>
              <MailOpen className="w-8 h-8 text-[#7A839E] mx-auto mb-3 animate-pulse" />
              <p className="font-mono text-xs text-[#7A839E] uppercase">{t.empty}</p>
            </div>
          ) : (
            filteredMails.map((mail) => {
              const isSelected = activeMessage && activeMessage.id === mail.id;
              
              return (
                <div
                  key={mail.id}
                  onClick={() => setActiveMessage(mail)}
                  className={`border p-4 cursor-pointer relative rounded-[1.5rem] transition-all duration-150 ${
                    isSelected 
                      ? isLight
                        ? "bg-gradient-to-br from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white border-transparent shadow-[0_4px_12px_rgba(0,130,255,0.2)] scale-[1.01]"
                        : "bg-[#1E2435] border-[#00f0ff]" 
                      : mail.unread 
                        ? isLight
                          ? "bg-amber-50/50 border-amber-300 hover:border-amber-400"
                          : "bg-[#FFB400]/5 border-[#FFB400]/40 hover:border-[#FFB400]" 
                        : isLight
                          ? "bg-white border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/40"
                          : "bg-[#131826]/30 border-[#1E2435] hover:border-[#7A839E]"
                  }`}
                >
                  {/* Amber unread dot indicator */}
                  {mail.unread && (
                    <span className={`absolute top-4 right-4 font-mono text-[9px] font-bold tracking-wider border px-1.5 py-0.5 rounded-full ${
                      isLight 
                        ? 'text-amber-800 bg-amber-100 border-amber-200' 
                        : 'text-[#FFB400] bg-[#FFB400]/10 border border-[#FFB400]/30'
                    }`}>
                      {t.unread}
                    </span>
                  )}

                  <div className="flex gap-3 pr-20">
                    <div className="mt-0.5">
                      {mail.unread ? (
                        <Mail className={`w-4.5 h-4.5 ${isLight ? 'text-amber-600' : 'text-[#FFB400]'}`} />
                      ) : (
                        <MailOpen className={`w-4.5 h-4.5 ${
                          isSelected && isLight ? 'text-zinc-300' : 'text-[#7A839E]'
                        }`} />
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <span className={`font-mono text-[11px] block truncate uppercase ${
                        isSelected && isLight ? 'text-zinc-300' : 'text-[#7A839E]'
                      }`}>
                        {mail.from}
                      </span>
                      <h4 className={`font-semibold text-sm mt-1 truncate ${
                        isSelected && isLight 
                          ? 'text-white' 
                          : isLight 
                            ? 'text-zinc-900 border-none font-sans' 
                            : 'text-white font-display'
                      }`}>
                        {mail.subject}
                      </h4>
                      <p className={`text-xs mt-1.5 line-clamp-1 ${
                        isSelected && isLight ? 'text-zinc-300' : 'text-[#7A839E]'
                      }`}>
                        {mail.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reader Panel Pane (Desktop View) */}
      <div className={`w-full lg:w-[450px] flex-shrink-0 flex flex-col border rounded-[2rem] p-6 h-fit relative min-h-[400px] transition-all duration-300 ${
        isLight 
          ? 'bg-white border-zinc-200 shadow-sm' 
          : 'border border-[#1E2435] bg-[#0a0e17]'
      }`}>
        {activeMessage ? (
          <div className="flex flex-col h-full">
            <div className={`flex justify-between items-start gap-4 border-b pb-4 ${
              isLight ? 'border-zinc-200' : 'border-[#1E2435]'
            }`}>
              <div className="min-w-0">
                <span className="font-mono text-[10px] text-[#7A839E] uppercase tracking-wider block">{t.from_node}</span>
                <span className={`font-mono text-xs truncate block font-semibold ${isLight ? 'text-zinc-800' : 'text-white'}`}>{activeMessage.from}</span>
              </div>
              
              {activeMessage.unread && (
                <button
                  onClick={() => {
                    onMarkRead(activeMessage.id);
                    setActiveMessage({ ...activeMessage, unread: false });
                  }}
                  className={`font-mono text-[10px] font-bold px-2.5 py-1.5 flex items-center gap-1.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                    isLight 
                      ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white shadow-[0_4px_10px_rgba(0,82,255,0.15)]' 
                      : 'bg-[#FFB400] hover:bg-amber-550 text-black'
                  }`}
                >
                  <CheckCircle className="w-3" /> {t.clear_alert}
                </button>
              )}
            </div>

            <div className="py-4">
              <span className="font-mono text-[10px] text-[#7A839E] uppercase tracking-wider block">{t.transmission_subject}</span>
              <h2 className={`font-bold text-md mt-1 leading-snug ${
                isLight ? 'text-zinc-950 font-sans' : 'text-white font-display'
              }`}>
                {activeMessage.subject}
              </h2>
            </div>

            <div className={`p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-text transition-all ${
              isLight 
                ? 'bg-zinc-50 border border-zinc-200 text-zinc-800' 
                : 'bg-[#131826]/40 border border-[#1E2435] text-white'
            }`}>
              {activeMessage.snippet}
              <p className={`text-[10px] mt-8 pt-4 border-t uppercase ${
                isLight ? 'border-zinc-200 text-zinc-400' : 'border-[#1E2435] text-[#7A839E]'
              }`}>
                {t.tether}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
            <AlertTriangle className="w-10 h-10 text-[#7A839E] mb-3 opacity-60" />
            <h4 className={`font-semibold ${isLight ? 'text-zinc-800 font-sans' : 'text-white font-display'}`}>{t.no_active}</h4>
            <p className="font-mono text-[10px] text-[#7A839E] uppercase mt-1 leading-snug">{t.desc_empty}</p>
          </div>
        )}
      </div>

    </div>
  );
}
