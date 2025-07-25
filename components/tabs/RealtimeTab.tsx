import React from 'react';
import type { SupabaseLead } from '../../types';
import SupabaseLeadCard from '../ui/SupabaseLeadCard';
import Loader from '../ui/Loader';

interface RealtimeTabProps {
    leads: SupabaseLead[];
    loading: boolean;
}

const RealtimeTab: React.FC<RealtimeTabProps> = ({ leads, loading }) => {
    return (
        <div className="space-y-4">
            {loading && (
                <div className="flex justify-center py-20">
                    <Loader />
                </div>
            )}
            {!loading && leads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                    <p className="text-xl font-bold text-gray-300">في انتظار البيانات</p>
                    <p className="text-gray-400 mt-2">لا توجد بيانات فورية حالياً. سيتم عرضها هنا عند وصولها.</p>
                </div>
            )}
            {!loading && leads.map((lead) => (
                <SupabaseLeadCard key={lead.id} lead={lead} />
            ))}
        </div>
    );
};

export default RealtimeTab;