import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, X } from 'lucide-react';
import { useRestaurantSettings } from '../context/RestaurantSettingsContext';

interface TableFloorItem {
  id: string;
  tableNumber: string;
  status: 'normal' | 'calling'; // calling = active pending waiter call
  callRequestType?: string;
  timeAgo?: string;
}

interface AttendedLogItem {
  id: string;
  tableNumber: string;
  requestType: string;
  requestedTime: string;
  attendedTime: string;
  date: string;
}

export const WaiterCallsSection: React.FC = () => {
  const { settings } = useRestaurantSettings();
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Attended'>('All');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Tables state initialized dynamically from settings.numberOfTables
  const [tables, setTables] = useState<TableFloorItem[]>(() => {
    return Array.from({ length: settings.numberOfTables }, (_, i) => {
      const num = i + 1;
      const id = `t${num}`;
      const tableNumber = `T${num}`;
      if (num === 2) {
        return { id, tableNumber, status: 'calling', callRequestType: 'Cutlery', timeAgo: '02:15 PM' };
      }
      if (num === 4) {
        return { id, tableNumber, status: 'calling', callRequestType: 'Bill', timeAgo: '02:18 PM' };
      }
      if (num === 7) {
        return { id, tableNumber, status: 'calling', callRequestType: 'Water Refill', timeAgo: '02:22 PM' };
      }
      if (num === 10) {
        return { id, tableNumber, status: 'calling', callRequestType: 'Assistance', timeAgo: '02:25 PM' };
      }
      return { id, tableNumber, status: 'normal' };
    });
  });

  // Re-synchronize when settings.numberOfTables is updated in Settings
  useEffect(() => {
    setTables((prev) => {
      return Array.from({ length: settings.numberOfTables }, (_, i) => {
        const num = i + 1;
        const id = `t${num}`;
        const tableNumber = `T${num}`;
        const existing = prev.find((t) => t.tableNumber === tableNumber);
        if (existing) return existing;
        return { id, tableNumber, status: 'normal' };
      });
    });
  }, [settings.numberOfTables]);

  // Audit log of all attended requests
  const [attendedLogs, setAttendedLogs] = useState<AttendedLogItem[]>([
    {
      id: 'log-1',
      tableNumber: 'T1',
      requestType: 'Cutlery & Napkins',
      requestedTime: '01:10 PM',
      attendedTime: '01:12 PM',
      date: 'Today',
    },
    {
      id: 'log-2',
      tableNumber: 'T3',
      requestType: 'Water Refill',
      requestedTime: '01:15 PM',
      attendedTime: '01:17 PM',
      date: 'Today',
    },
    {
      id: 'log-3',
      tableNumber: 'T6',
      requestType: 'Print Bill',
      requestedTime: '01:30 PM',
      attendedTime: '01:33 PM',
      date: 'Today',
    },
    {
      id: 'log-4',
      tableNumber: 'T8',
      requestType: 'Assistance (Extra Menu)',
      requestedTime: '01:45 PM',
      attendedTime: '01:47 PM',
      date: 'Today',
    },
    {
      id: 'log-5',
      tableNumber: 'T5',
      requestType: 'Bill',
      requestedTime: '02:02 PM',
      attendedTime: '02:05 PM',
      date: 'Today',
    },
  ]);

  const pendingCount = tables.filter((t) => t.status === 'calling').length;
  const attendedCount = attendedLogs.length;

  const handleMarkAttended = (table: TableFloorItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!table.callRequestType) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: AttendedLogItem = {
      id: `log-${Date.now()}`,
      tableNumber: table.tableNumber,
      requestType: table.callRequestType,
      requestedTime: table.timeAgo ? `${table.timeAgo}` : 'Just now',
      attendedTime: timeStr,
      date: 'Today',
    };

    setAttendedLogs((prev) => [newLog, ...prev]);

    setTables((prev) =>
      prev.map((t) => (t.id === table.id ? { ...t, status: 'normal', callRequestType: undefined, timeAgo: undefined } : t))
    );
  };

  const filteredTables = tables.filter((t) => {
    if (filterTab === 'Pending') return t.status === 'calling';
    return true; // 'All'
  });

  const filteredLogs = attendedLogs.filter((log) =>
    log.tableNumber.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    log.requestType.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* Top Action Bar: Waiter Calls Title on Left & Filter Capsule Bar on Right */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 tracking-tight">
            Waiter Calls
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-2xs">
          {(['All', 'Pending', 'Attended'] as const).map((tab) => {
            const isSelected = filterTab === tab;
            const count = tab === 'Pending' ? pendingCount : tab === 'Attended' ? attendedCount : tables.length;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#e57e7c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {filterTab === 'Attended' ? (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-md shadow-slate-200/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-black text-slate-900 text-lg tracking-tight font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Attended Requests Audit Log</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Proof of fulfillment for customer requests and service history.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Highlighted count of waiter calls attended/completed today */}
              <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200/90 px-3.5 py-1.5 rounded-2xl shadow-2xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 tracking-tight">Total Calls :</span>
                <span className="text-sm font-black font-mono text-emerald-700 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-300/80 shadow-2xs">
                  {attendedCount}
                </span>
              </div>

              {/* Search Bar beside count badge */}
              <div className="relative w-full sm:w-72">
                <div className="relative flex items-center bg-white border border-slate-200/90 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 rounded-2xl px-3.5 py-2 transition-all shadow-2xs">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    placeholder="Search table or request..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 outline-none"
                  />
                  {auditSearchQuery && (
                    <button
                      onClick={() => setAuditSearchQuery('')}
                      className="p-0.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <p className="font-extrabold text-sm text-slate-700">No attended request logs found</p>
              <p className="text-xs text-slate-400 mt-0.5">Requests marked as attended will appear here as permanent proof.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Service Request</th>
                    <th className="py-3 px-4">Requested At</th>
                    <th className="py-3 px-4">Attended At</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900 font-display">
                        Table {log.tableNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {log.requestType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {log.requestedTime}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                        {log.attendedTime}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                          ✓ Fulfilled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-inner relative min-h-[480px] flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 items-center justify-items-center py-6">
            {filteredTables.map((table) => {
              const isCalling = table.status === 'calling';

              const tableBgClass = isCalling
                ? 'bg-[#e57e7c] border-[#d9706e] text-white shadow-xl shadow-rose-500/25'
                : 'bg-white border-slate-200 text-slate-800 shadow-md';

              const chairBgClass = isCalling
                ? 'bg-[#e57e7c] border-[#d9706e]'
                : 'bg-slate-200 border-slate-300';

              return (
                <div key={table.id} className="relative p-2 flex items-center justify-center">
                  {/* 4 Attached Chair Blocks */}
                  <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-lg border-t border-x ${chairBgClass}`} />
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-b-lg border-b border-x ${chairBgClass}`} />
                  <div className={`absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-10 rounded-l-lg border-l border-y ${chairBgClass}`} />
                  <div className={`absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-10 rounded-r-lg border-r border-y ${chairBgClass}`} />

                  {/* Main Square Table Card */}
                  <div
                    onClick={(e) => {
                      if (isCalling) handleMarkAttended(table, e);
                    }}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-[22px] w-30 h-30 sm:w-34 sm:h-34 border-2 shadow-md cursor-pointer transition-transform active:scale-95 ${tableBgClass}`}
                    title={isCalling ? "Click anywhere on card to mark as attended" : ""}
                  >
                    {/* Timestamp placed in top-right side corner */}
                    {isCalling && (
                      <span className="absolute top-2 right-2 text-[10px] font-extrabold text-white/90 font-mono">
                        {table.timeAgo}
                      </span>
                    )}

                    {/* Table Number */}
                    <span className={`font-black font-display text-sm ${isCalling ? 'text-white' : 'text-slate-900'}`}>
                      Table {table.tableNumber}
                    </span>

                    {/* Request Type: Shortened & Larger/Bolder font for easy readability */}
                    {isCalling ? (
                      <div className="mt-1 text-center w-full px-1">
                        <span className="text-white font-black text-xs tracking-tight truncate max-w-full block leading-snug drop-shadow-xs">
                          {table.callRequestType}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-center text-[11px] font-bold text-slate-400">
                        Normal
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
