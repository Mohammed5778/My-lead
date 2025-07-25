import React, { useState, FormEvent } from 'react';
import { supabase } from '../services/supabase';
import { LogoIcon } from './ui/icons';

const AuthView: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error: authError } = isSignIn
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });
            
            if (authError) throw authError;

            if (!isSignIn) {
                setMessage('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني للتفعيل.');
            }
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <LogoIcon className="h-12 w-12 mx-auto text-cyan-400" />
                    <h1 className="mt-4 text-3xl font-bold text-white">منصة العملاء الذكية</h1>
                    <p className="mt-2 text-gray-400">
                        {isSignIn ? 'مرحباً بعودتك! قم بتسجيل الدخول للمتابعة.' : 'انضم إلينا وابدأ في تحويل بياناتك إلى فرص.'}
                    </p>
                </div>
                <div className="p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl">
                    <h2 className="text-center text-2xl font-bold text-cyan-400">
                        {isSignIn ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </h2>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="كلمة المرور"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-bold text-gray-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'جاري...' : (isSignIn ? 'دخول' : 'إنشاء حساب')}
                        </button>
                    </form>
                    {error && <div className="text-center text-red-400 h-5 text-sm">{error}</div>}
                    {message && <div className="text-center text-green-400 h-5 text-sm">{message}</div>}
                    <p className="text-center text-sm">
                        <button onClick={() => { setIsSignIn(!isSignIn); setError(null); setMessage(null); }} className="text-cyan-400 hover:underline">
                            {isSignIn ? 'ليس لديك حساب؟ إنشاء حساب' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthView;