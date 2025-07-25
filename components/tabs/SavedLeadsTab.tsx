import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { AILead } from '../../types';
import AiLeadCard from '../ui/AiLeadCard';
import Loader from '../ui/Loader';

interface SavedLeadsTabProps {
    userId: string;
    setStatusMessage: (message: string) => void;
}

const SavedLeadsTab: React.FC<SavedLeadsTabProps> = ({ userId, setStatusMessage }) => {
    const [savedLeads, setSavedLeads] = useState<AILead[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedLeads = useCallback(async () => {
        setLoading(true);
        setStatusMessage('جاري جلب العملاء المحفوظين...');
        const { data, error } = await supabase
            .from('my_lead')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching saved leads:", error.message, {
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            setStatusMessage(`فشل جلب البيانات: ${error.message}`);
            setSavedLeads([]);
        } else {
            setSavedLeads(data || []);
            setStatusMessage(data && data.length > 0 ? `تم العثور على ${data.length} عميل محفوظ.` : '');
        }
        setLoading(false);
    }, [userId, setStatusMessage]);

    useEffect(() => {
        fetchSavedLeads();
    }, [fetchSavedLeads]);

    return (
        <div className="space-y-4">
            {loading && (
                <div className="flex justify-center py-20">
                    <Loader />
                </div>
            )}
            {!loading && savedLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                    <p className="text-xl font-bold text-gray-300">لا يوجد عملاء محفوظون</p>
                    <p className="text-gray-400 mt-2">استخدم تبويب "تحليل AI" لتوليد وحفظ العملاء.</p>
                </div>
            )}
            {!loading && savedLeads.map((lead) => (
                <AiLeadCard key={lead.id} lead={lead} />
            ))}
        </div>
    );
};

export default SavedLeadsTab;