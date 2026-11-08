import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, X } from 'lucide-react';
import { useRestaurantSettings } from '../context/RestaurantSettingsContext';

interface TableFloorItem {
  id: string;
  tableNumber: string;
  status: 'normal' | 'calling';
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
      prev.map((t) =>
        t.id === table.id ? { ...t, status: 'normal', callRequestType: undefined, timeAgo: undefined } : t
      )
    );
  };

  const filteredTables = tables.filter((t) => {
    if (filterTab === 'Pending') return t.status === 'calling';
    return true;
  });

  const filteredLogs = attendedLogs.filter(
    (log) =>
      log.tableNumber.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.requestType.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4 animate-in fade-in duration-300 select-none overflow-hidden">
      {/* Fixed Top Action Bar */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-4 bg-white rounded-[28px] px-6 py-4 shadow-[0_8px_28px_rgba(20,25,45,0.04)]">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1a1f36] tracking-[-0.01em]">
            Waiter Calls
          </h3>
          <p className="text-xs text-[#8c93a4] font-medium mt-0.5">
            Click any active table call to mark it attended
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#f7f8fa] p-1.5 rounded-full">
          {(['All', 'Pending', 'Attended'] as const).map((tab) => {
            const isSelected = filterTab === tab;
            const count =
              tab === 'Pending' ? pendingCount : tab === 'Attended' ? attendedCount : tables.length;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#313b68] text-white font-semibold shadow-2xs'
                    : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold tabular-nums ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#e8ecf7] text-[#313b68]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4">
      {filterTab === 'Attended' ? (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_8px_28px_rgba(20,25,45,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-[#1a1f36] text-[17px] tracking-[-0.01em] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#229a54]" />
                <span>Attended Requests Audit Log</span>
              </h4>
              <p className="text-xs text-[#8c93a4] font-medium mt-0.5">
                Fulfillment history for customer table requests
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-[#e6f6ec] text-[#229a54] px-3.5 py-1.5 rounded-full shrink-0 text-xs font-semibold">
                <span>Fulfilled today:</span>
                <span className="tabular-nums font-bold">{attendedCount}</span>
              </div>

              <div className="relative w-full sm:w-64">
                <div className="flex items-center bg-[#f7f8fa] rounded-full px-3.5 py-2">
                  <Search className="w-4 h-4 text-[#8c93a4] shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search table or request..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-[#1a1f36] placeholder-[#8c93a4] outline-none"
                  />
                  {auditSearchQuery && (
                    <button
                      onClick={() => setAuditSearchQuery('')}
                      className="p-0.5 text-[#8c93a4] hover:text-[#1a1f36]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-[#8c93a4] bg-[#f7f8fa] rounded-[22px]">
              <p className="font-semibold text-sm text-[#1a1f36]">No attended request logs found</p>
              <p className="text-xs text-[#8c93a4] mt-0.5">
                Requests marked as attended will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-[#8c93a4] tracking-wider">
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Service Request</th>
                    <th className="py-3 px-4">Requested At</th>
                    <th className="py-3 px-4">Attended At</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-[#1a1f36]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f7f8fa] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#1a1f36]">
                        Table {log.tableNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1a1f36]">
                        {log.requestType}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-[#8c93a4]">
                        {log.requestedTime}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-[#229a54] font-semibold">
                        {log.attendedTime}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-[#e6f6ec] text-[#229a54] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
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
        <div className="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_8px_28px_rgba(20,25,45,0.04)] min-h-[480px] flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 items-center justify-items-center py-4">
            {filteredTables.map((table) => {
              const isCalling = table.status === 'calling';

              const tableBgClass = isCalling
                ? 'bg-[#313b68] border-[#313b68] text-white shadow-[0_12px_28px_rgba(49,59,104,0.28)]'
                : 'bg-[#f7f8fa] border-slate-200/80 text-[#1a1f36]';

              const chairBgClass = isCalling
                ? 'bg-[#313b68] border-[#252e54]'
                : 'bg-[#e4e7f0] border-[#d5dae5]';

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
                    className={`relative flex flex-col items-center justify-center p-3 rounded-[24px] w-30 h-30 sm:w-34 sm:h-34 border cursor-pointer transition-transform active:scale-95 ${tableBgClass}`}
                    title={isCalling ? 'Click to mark as attended' : ''}
                  >
                    {isCalling && (
                      <span className="absolute top-2.5 right-3 text-[10px] font-medium text-white/80 tabular-nums">
                        {table.timeAgo}
                      </span>
                    )}

                    <span className={`font-semibold text-sm ${isCalling ? 'text-white' : 'text-[#1a1f36]'}`}>
                      Table {table.tableNumber}
                    </span>

                    {isCalling ? (
                      <div className="mt-1.5 text-center w-full px-1">
                        <span className="inline-block bg-white/15 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-full truncate max-w-full">
                          {table.callRequestType}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-center text-[11px] font-medium text-[#8c93a4]">
                        Available
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
    </div>
  );
};
