import React, { useState, useEffect } from 'react';
import { History, Shield, Filter, Search, UserCheck, Clock, Flame } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminFilter, setAdminFilter] = useState('ALL');
  const toast = useToast();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (adminFilter !== 'ALL') params.append('adminName', adminFilter);
      params.append('limit', '100');

      const res = await api.get(`/admin/activities?${params.toString()}`);
      setActivities(res.data.activities || []);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [adminFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="badge-gold">AUDIT & ACCOUNTABILITY</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            DUAL-ADMIN ACTIVITY LOGS
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Complete audit trail of all product modifications, stock edits, and order updates by Shoeb Khan & Shan Khan.
          </p>
        </div>

        {/* Filter by Founder */}
        <div className="flex items-center gap-2">
          {['ALL', 'Shoeb Khan', 'Shan Khan'].map((adm) => (
            <button
              key={adm}
              onClick={() => setAdminFilter(adm)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                adminFilter === adm
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {adm}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Name</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-neutral-500">Loading audit trail...</td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-neutral-500">No activity logs recorded yet</td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act._id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-4 whitespace-nowrap text-neutral-400">
                      {new Date(act.createdAt).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          act.adminName === 'Shoeb Khan'
                            ? 'bg-red-950 text-red-300 border border-red-800/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {act.adminName}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-[11px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                        {act.action}
                      </span>
                    </td>

                    <td className="p-4 text-white font-medium">
                      {act.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminLogs;
