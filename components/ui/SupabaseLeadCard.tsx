import React from 'react';
import { SupabaseLead } from '../../types';
import { LinkIcon, UserIcon } from './icons';

interface SupabaseLeadCardProps {
    lead: SupabaseLead;
}

const SupabaseLeadCard: React.FC<SupabaseLeadCardProps> = ({ lead }) => {
    const postTitle = lead.post_title || 'عنوان غير متوفر';
    const postUrl = lead.post_url || '#';
    const authorName = lead.author_name || 'اسم الكاتب غير متوفر';
    const authorUrl = lead.author_url || '#';
    const authorDescription = lead.author_description || 'لا يوجد وصف للكاتب.';

    return (
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/5 fade-in-animation">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                     <a href={postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-cyan-300 transition-colors group">
                        <LinkIcon className="h-5 w-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        <span className="break-words">{postTitle}</span>
                    </a>
                    <div className="mt-4 flex items-start gap-3">
                        <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                           <UserIcon className="h-10 w-10 text-gray-500 bg-gray-700 rounded-full p-2" />
                        </a>
                        <div>
                            <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-200 hover:underline">
                                {authorName}
                            </a>
                            <p className="text-gray-400 mt-1 text-sm break-words line-clamp-2">{authorDescription}</p>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-500 shrink-0 text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                    {new Date(lead.created_at).toLocaleString('ar-EG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            </div>
        </div>
    );
};

export default SupabaseLeadCard;