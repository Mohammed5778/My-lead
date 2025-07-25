import React, { useState } from 'react';
import type { AILead } from '../../types';
import { EmailIcon, PhoneIcon, ProfileIcon, CopyIcon, InterestsIcon, SummaryIcon } from './icons';

interface AiLeadCardProps {
    lead: AILead;
}

const SuccessRing: React.FC<{ rate: number }> = ({ rate }) => {
    const size = 60;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (rate / 100) * circumference;

    let color = 'stroke-red-400';
    if (rate > 75) color = 'stroke-green-400';
    else if (rate > 50) color = 'stroke-yellow-400';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="absolute inset-0" width={size} height={size}>
                <circle
                    className="stroke-gray-700"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {rate}%
            </div>
        </div>
    );
};

const AiLeadCard: React.FC<AiLeadCardProps> = ({ lead }) => {
    const [copyText, setCopyText] = useState('نسخ');

    const handleCopy = () => {
        navigator.clipboard.writeText(lead.message_content);
        setCopyText('تم النسخ!');
        setTimeout(() => setCopyText('نسخ'), 2000);
    };

    return (
        <div className="bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/5 fade-in-animation">
            {/* Header */}
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex items-center gap-4">
                     <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <ProfileIcon className="h-12 w-12 text-gray-400 bg-gray-700 rounded-full p-2 hover:text-cyan-400 transition-colors" />
                     </a>
                    <div>
                        <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="font-bold text-xl text-white hover:underline">{lead.full_name}</a>
                        <div className="flex items-center text-sm text-gray-400 mt-1 gap-2">
                            <InterestsIcon className="h-4 w-4 shrink-0" />
                            <span>{lead.interests}</span>
                        </div>
                    </div>
                </div>
                <div className="text-center shrink-0 self-end sm:self-center">
                    <SuccessRing rate={lead.success_rate} />
                </div>
            </div>

            {/* Message & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-cyan-400 font-semibold mb-2 gap-2">
                        <SummaryIcon className="h-5 w-5" />
                        <span>ملخص المنشور</span>
                    </div>
                    <p className="text-sm text-gray-300">{lead.post_summary}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="font-semibold text-cyan-400">رسالة مقترحة</h4>
                         <button onClick={handleCopy} className="text-xs bg-gray-600 hover:bg-cyan-700 text-white py-1 px-2 rounded-md flex items-center gap-1 transition-colors shrink-0">
                            <CopyIcon className="h-4 w-4" />
                            <span>{copyText}</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap line-clamp-3">{lead.message_content}</p>
                </div>
            </div>

            {/* Contact Info Footer */}
            <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h4 className="font-semibold text-gray-400 shrink-0">معلومات الاتصال</h4>
                    {lead.email || lead.phone ? (
                         <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300 text-sm">
                            {lead.email && <li><a href={`mailto:${lead.email}`} className="hover:text-cyan-400 flex items-center gap-2"><EmailIcon className="h-5 w-5" /> <span>{lead.email}</span></a></li>}
                            {lead.phone && <li><span className="flex items-center gap-2"><PhoneIcon className="h-5 w-5" /> <span>{lead.phone}</span></span></li>}
                        </ul>
                    ) : <p className="text-sm text-gray-500">لم يتم العثور على معلومات اتصال.</p>}
                </div>
            </div>
        </div>
    );
};

export default AiLeadCard;