'use client';

import { useEffect, useState } from 'react';

interface PendingRecord {
  id: string;
  type: string;
  description: string;
  date: string;
}

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([]);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Check IndexedDB for pending records
    checkPendingRecords();

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  async function checkPendingRecords() {
    try {
      if (!('indexedDB' in window)) return;
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const req = store.getAll();
      req.onsuccess = () => {
        const records = req.result || [];
        setPendingCount(records.length);
        setPendingRecords(records.map((r: { id: string; type: string; description?: string; createdAt?: string }) => ({
          id: r.id || String(Math.random()),
          type: r.type || 'record',
          description: r.description || 'Pending record',
          date: r.createdAt || new Date().toISOString(),
        })));
      };
    } catch {
      // IndexedDB not available or empty
    }
  }

  function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('fieldkeeper_offline', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  if (isOnline && pendingCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowQueue(!showQueue)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          isOnline
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          isOnline ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
        }`} />
        <span className="flex-1 text-left">
          {isOnline
            ? `Syncing — ${pendingCount} record${pendingCount !== 1 ? 's' : ''} pending`
            : `Offline — ${pendingCount} record${pendingCount !== 1 ? 's' : ''} pending`
          }
        </span>
        <span className="text-[10px]">{showQueue ? '▲' : '▼'}</span>
      </button>

      {showQueue && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700">Pending Sync</span>
            <button className="text-primary hover:underline text-[11px]" onClick={checkPendingRecords}>
              Retry All
            </button>
          </div>
          {pendingRecords.length === 0 ? (
            <p className="text-slate-400 py-2">No pending records</p>
          ) : (
            <ul className="space-y-1.5">
              {pendingRecords.map((r) => (
                <li key={r.id} className="flex items-center gap-2 text-slate-600">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                  <span className="flex-1">{r.description}</span>
                  <span className="text-slate-400">{new Date(r.date).toLocaleDateString('en-GB')}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-slate-400 mt-2 text-[10px]">
            Records sync automatically when connection is restored.
          </p>
        </div>
      )}
    </>
  );
}
