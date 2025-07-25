import React, { useState, FormEvent } from 'react';
import type { SupabaseLead, AILead } from '../../types';
import { analyzeLeadsWithAI } from '../../services/geminiService';
import { supabase } from '../../services/supabase';
import Loader from '../ui/Loader';
import AiLeadCard from '../ui/AiLeadCard';
import type { Database } from '../../services/database.types';

interface AiAnalysisTabProps {
    leadsData: SupabaseLead[];
    userId: string;
    setStatusMessage: (message: string) => void;
}

const AiAnalysisTab: React.FC<AiAnalysisTabProps> = ({ leadsData, userId, setStatusMessage }) => {
    const [myBusiness, setMyBusiness] = useState('');
    const [targetCustomer, setTargetCustomer] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiResults, setAiResults] = useState<AILead[] | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!myBusiness || !targetCustomer) {
            setStatusMessage('يرجى ملء حقلي مجالك وعميلك المستهدف.');
            return;
        }
        if (leadsData.length === 0) {
            setStatusMessage('لا توجد بيانات فورية للتحليل. يرجى الانتظار أو استخدام البحث المخصص.');
            return;
        }

        setLoading(true);
        setAiResults(null);
        setStatusMessage('يقوم الذكاء الاصطناعي بالتحليل، قد يستغرق هذا بعض الوقت...');

        try {
            const results = await analyzeLeadsWithAI(myBusiness, targetCustomer, leadsData);
            setAiResults(results);
            
            if (results && results.length > 0) {
                setStatusMessage('تم التحليل! جاري حفظ النتائج...');
                
                const leadsToInsert: Database['public']['Tables']['my_lead']['Insert'][] = results.map(lead => ({
                    full_name: lead.full_name,
                    interests: lead.interests,
                    success_rate: lead.success_rate,
                    phone: lead.phone ?? null,
                    email: lead.email ?? null,
                    profile_url: lead.profile_url,
                    post_text: lead.post_text,
                    post_summary: lead.post_summary,
                    message_content: lead.message_content,
                }));

                const { error } = await supabase.from('my_lead').insert(leadsToInsert);

                if (error) {
                    throw new Error(`فشل حفظ العملاء: ${error.message}`);
                }
                setStatusMessage(`تم حفظ ${results.length} عميل محتمل بنجاح.`);
            } else {
                setStatusMessage('لم يجد الذكاء الاصطناعي أي عملاء مطابقين.');
            }

        } catch (error: any) {
            console.error("AI Analysis Error:", error);
            setStatusMessage(`حدث خطأ أثناء التحليل: ${error.message}`);
            setAiResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">إعدادات التحليل</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="my-business" className="block mb-2 text-sm font-medium text-gray-300">مجالك ومشروعك</label>
                        <textarea
                            id="my-business"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="مثال: أقدم خدمات تسويق رقمي للمطاعم."
                            value={myBusiness}
                            onChange={(e) => setMyBusiness(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="target-customer" className="block mb-2 text-sm font-medium text-gray-300">عميلك المستهدف</label>
                        <textarea
                            id="target-customer"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="مثال: أبحث عن مدراء التسويق أو أصحاب المطاعم."
                            value={targetCustomer}
                            onChange={(e) => setTargetCustomer(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 font-bold text-lg text-gray-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader /> : <span>حلل وجهز الرسائل</span>}
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <div className="space-y-4">
                    {loading && (
                        <div className="flex justify-center items-center h-96">
                            <Loader />
                        </div>
                    )}
                    {!loading && aiResults === null && (
                        <div className="flex flex-col items-center justify-center h-96 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700 text-center p-4">
                            <p className="text-xl font-bold text-gray-300">ابدأ التحليل الآن</p>
                            <p className="text-gray-400 mt-2">أدخل معلوماتك في اللوحة اليمنى لبدء توليد العملاء.</p>
                        </div>
                    )}
                    {!loading && aiResults && aiResults.length === 0 && (
                         <div className="flex flex-col items-center justify-center h-96 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700 text-center p-4">
                            <p className="text-xl font-bold text-gray-300">لا توجد نتائج مطابقة</p>
                            <p className="text-gray-400 mt-2">لم يتمكن الذكاء الاصطناعي من العثور على عملاء يطابقون المعايير.</p>
                        </div>
                    )}
                    {!loading && aiResults && aiResults.length > 0 && (
                        aiResults.map((lead, index) => <AiLeadCard key={index} lead={lead} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiAnalysisTab;