import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface GatekeeperProps {
    children: React.ReactNode;
}

const PASSWORD = '123456';
const SESSION_KEY = 'site_public_access';

const Gatekeeper: React.FC<GatekeeperProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const hasAccess = sessionStorage.getItem(SESSION_KEY);
        if (hasAccess === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input === PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setInput('');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-800">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
                    Protected Site
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    Please enter the access password to view this website.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(false);
                            }}
                            className={`w-full p-4 text-center text-lg tracking-widest border rounded-lg outline-none transition-all ${error
                                    ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                                    : 'border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                                }`}
                            placeholder="Enter Password"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm text-center mt-2">
                                Incorrect password. Please try again.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Enter Site <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Gatekeeper;
