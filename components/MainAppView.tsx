import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Session } from '@supabase/supabase-js';
import type { SupabaseLead, Page } from '../types';
import AiAnalysisTab from './tabs/AiAnalysisTab';
import RealtimeTab from './tabs/RealtimeTab';
import SearchTab from './tabs/SearchTab';
import SavedLeadsTab from './tabs/SavedLeadsTab';
import { DashboardIcon, BoltIcon, BookmarkIcon, SearchIcon, LogoutIcon, LogoIcon, MenuIcon, CloseIcon } from './ui/icons';

interface MainAppViewProps {
    session: Session;
}

const pageConfig = {
    search: { title: 'البحث المخصص', icon: SearchIcon },
    dashboard: { title: 'لوحة التحكم وتحليل AI', icon: DashboardIcon },
    realtime: { title: 'البيانات الفورية', icon: BoltIcon },
    saved: { title: 'العملاء المحفوظون', icon: BookmarkIcon },
};

const MainAppView: React.FC<MainAppViewProps> = ({ session }) => {
    const [activePage, setActivePage] = useState<Page>('search');
    const [statusMessage, setStatusMessage] = useState('');
    const [allLeadsData, setAllLeadsData] = useState<SupabaseLead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => supabase.auth.signOut();

    const fetchInitialLeads = useCallback(async () => {
        setLoadingLeads(true);
        const { data, error } = await supabase
            .from('lead')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            setStatusMessage(`فشل في جلب البيانات: ${error.message}`);
        } else {
            setAllLeadsData(data as SupabaseLead[]);
        }
        setLoadingLeads(false);
    }, []);

    useEffect(() => {
        fetchInitialLeads();
    }, [fetchInitialLeads]);

    useEffect(() => {
        const channel = supabase.channel('public:lead')
            .on<SupabaseLead>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lead' }, payload => {
                setAllLeadsData(prevLeads => [payload.new as SupabaseLead, ...prevLeads]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);
    
    const renderActivePage = () => {
        const pageContent = () => {
            switch (activePage) {
                case 'dashboard':
                    return <AiAnalysisTab leadsData={allLeadsData} userId={session.user.id} setStatusMessage={setStatusMessage} />;
                case 'realtime':
                    return <RealtimeTab leads={allLeadsData} loading={loadingLeads} />;
                case 'saved':
                    return <SavedLeadsTab userId={session.user.id} setStatusMessage={setStatusMessage} />;
                case 'search':
                    return <SearchTab setStatusMessage={setStatusMessage} userId={session.user.id} />;
                default:
                    return null;
            }
        };
        return <div className="fade-in-animation">{pageContent()}</div>
    };
    
    const NavLink: React.FC<{page: Page; children: React.ReactNode}> = ({ page, children }) => {
        const isActive = activePage === page;
        return (
            <button
                onClick={() => {
                    setActivePage(page);
                    setIsSidebarOpen(false); // Close sidebar on navigation
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-cyan-400/10 text-cyan-300'
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
            >
                {children}
            </button>
        )
    }

    const SidebarContent = () => (
        <>
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-cyan-400" />
                    <span className="text-xl font-bold text-white">العملاء</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </div>
            <nav className="flex-grow space-y-2">
                {(Object.keys(pageConfig) as Page[]).map(page => {
                    const config = pageConfig[page];
                    const Icon = config.icon;
                    return (
                         <NavLink key={page} page={page}>
                            <Icon className="h-6 w-6 ml-4" />
                            <span>{config.title}</span>
                        </NavLink>
                    )
                })}
            </nav>
            <div className="pt-4 border-t border-gray-800">
                <div className="px-3 mb-3">
                    <p className="text-sm text-gray-400">مرحباً بك،</p>
                    <p className="font-medium text-white truncate">{session.user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-lg transition-colors text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogoutIcon className="h-6 w-6 ml-4" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Sidebar for Desktop */}
            <aside className="w-64 bg-gray-950 p-4 flex-col border-l border-gray-800 hidden lg:flex">
                <SidebarContent />
            </aside>

             {/* Mobile Sidebar & Overlay */}
            <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
                {/* Sidebar */}
                <aside className="fixed top-0 bottom-0 right-0 w-64 bg-gray-950 p-4 flex flex-col border-l border-gray-800 transform transition-transform duration-300 ease-in-out">
                    <SidebarContent />
                </aside>
            </div>


            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{pageConfig[activePage].title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-300 hover:text-white">
                        <MenuIcon className="h-7 w-7"/>
                    </button>
                </header>
                 <div className="flex-grow overflow-y-auto pr-2">
                    <p className="text-gray-400 mb-4 h-5">{statusMessage || ' '}</p>
                    {renderActivePage()}
                </div>
            </main>
        </div>
    );
};

export default MainAppView;
