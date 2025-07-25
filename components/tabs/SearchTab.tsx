import React, { useState, FormEvent } from 'react';
import Loader from '../ui/Loader';

interface SearchTabProps {
    setStatusMessage: (message: string) => void;
    userId: string;
}

const SearchTab: React.FC<SearchTabProps> = ({ setStatusMessage, userId }) => {
    const [formData, setFormData] = useState({ industry: '', country: '', problem_keyword: '' });
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        setStatusMessage('جاري إرسال طلب البحث...');

        try {
            const webhookUrl = 'https://jipejol859.app.n8n.cloud/webhook/913e34d9-0aed-413a-bb03-e2a51ac0e309';
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, user_id: userId })
            });

            if (!response.ok) {
                throw new Error(`فشل الطلب، الحالة: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data);
            setStatusMessage('تم استلام نتائج البحث بنجاح!');

        } catch (error: any) {
            setStatusMessage('فشل البحث: ' + error.message);
            setResults({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-cyan-400">البحث المخصص عن عملاء</h1>
                    <p className="mt-1 text-gray-400 text-sm">أدخل المعايير لإرسال طلب بحث إلى n8n.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="industry" placeholder="مجال الشركة" onChange={handleChange} value={formData.industry} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
                    <input type="text" name="country" placeholder="الدولة" onChange={handleChange} value={formData.country} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
                    <input type="text" name="problem_keyword" placeholder="الكلمة الدالة" onChange={handleChange} value={formData.problem_keyword} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 font-bold text-lg text-gray-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 disabled:bg-gray-600 transition-colors">
                        {loading ? <Loader /> : <span>ابحث الآن</span>}
                    </button>
                </form>
            </div>
            {results && (
                <div className="mt-6">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-white mb-2">نتائج البحث الخام (JSON)</h3>
                        <pre className="text-left whitespace-pre-wrap text-sm text-gray-300" dir="ltr">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchTab;