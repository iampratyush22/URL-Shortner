'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, ExternalLink, Activity, Copy } from 'lucide-react';
import api from '@/lib/axios';

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const [urls, setUrls] = useState<any[]>([]);
    const [loadingUrls, setLoadingUrls] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const fetchUrls = useCallback(async (currentPage: number) => {
        try {
            setLoadingUrls(true);
            const response = await api.get(`/shorten/app/v1/urls?page=${currentPage}&limit=${limit}`);
            setUrls(response.data.urls || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch user URLs:', error);
        } finally {
            setLoadingUrls(false);
        }
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        } else if (isAuthenticated) {
            fetchUrls(page);
        }
    }, [loading, isAuthenticated, router, page, fetchUrls]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShortUrl('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/shorten/app/v1/shorten', { longUrl });
            // Assuming response structure: { shortUrl: "shortCode" }
            // Construct full URL
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
            // The redirect service is at /redirect/{shortCode} via gateway
            const fullShortUrl = `${baseUrl}/r/${response.data.shortUrl}`;
            setShortUrl(fullShortUrl);

            // Refresh URL list on new creation
            fetchUrls(1);
            setPage(1);
        } catch (err: any) {

            console.log('Error ::', err);
            setError(err.response?.data?.message || 'Failed to shorten URL. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Shorten Your Links
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Paste your long URL below to create a short, shareable link.
                        </p>
                    </div>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Create New Link</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="longUrl" className="text-sm font-medium text-gray-300">
                                        Destination URL
                                    </label>
                                    <div className="flex gap-4">
                                        <Input
                                            id="longUrl"
                                            type="url"
                                            placeholder="https://example.com/very/long/url/path"
                                            value={longUrl}
                                            onChange={(e) => setLongUrl(e.target.value)}
                                            required
                                            className="flex-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                                        >
                                            {isSubmitting ? 'Shortening...' : 'Shorten'}
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                                        {error}
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {shortUrl && (
                        <Card className="bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 border-indigo-500/30 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="space-y-1 text-center sm:text-left">
                                        <p className="text-sm text-indigo-300 font-medium">Your Short Link</p>
                                        <a
                                            href={shortUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors break-all"
                                        >
                                            {shortUrl}
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                const code = shortUrl.split('/').pop();
                                                router.push(`/analytics/${code}`);
                                            }}
                                            variant="ghost"
                                            className="min-w-[100px] bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-all duration-200"
                                        >
                                            <Activity className="w-4 h-4 mr-2" />
                                            Analytics
                                        </Button>
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="secondary"
                                            className={`min-w-[100px] transition-all duration-200 ${copied ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-indigo-900 hover:bg-gray-100'}`}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            {copied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* URL History Section */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl mt-12">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                            <CardTitle className="text-xl">Your Links</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loadingUrls ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : urls.length === 0 ? (
                                <div className="text-center p-8 text-gray-400">
                                    <p>You haven't shortened any URLs yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 rounded-tl-lg">Short Link</th>
                                                <th scope="col" className="px-6 py-4">Original URL</th>
                                                <th scope="col" className="px-6 py-4 text-center rounded-tr-lg">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {urls.map((urlItem) => {
                                                const shortLink = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'}/r/${urlItem.shortCode}`;

                                                return (
                                                    <tr key={urlItem._id || urlItem.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <a
                                                                    href={shortLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                                                >
                                                                    {`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000').replace(/^https?:\/\//, '')}/r/${urlItem.shortCode}`}
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-[300px] truncate text-gray-300" title={urlItem.longUrl}>
                                                                {urlItem.longUrl}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-center gap-2">
                                                                <Button
                                                                    onClick={() => router.push(`/analytics/${urlItem.shortCode}`)}
                                                                    variant="ghost"
                                                                    className="h-8 px-3 text-xs bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                                                                >
                                                                    <Activity className="w-3 h-3 mr-1" />
                                                                    Stats
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(shortLink);
                                                                    }}
                                                                    variant="ghost"
                                                                    className="h-8 px-3 text-xs bg-gray-500/10 text-gray-300 hover:bg-gray-500/20"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        {totalPages > 1 && (
                                            <tfoot className="border-t border-white/5">
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-4">
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="text-gray-400 text-sm">
                                                                Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                                    disabled={page === 1}
                                                                    variant="outline"
                                                                    className="h-8 px-3 text-xs border-white/10 hover:bg-white/10"
                                                                >
                                                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                                                    Prev
                                                                </Button>
                                                                <Button
                                                                    onClick={() => setPage(p => p < totalPages ? p + 1 : p)}
                                                                    disabled={page >= totalPages}
                                                                    variant="outline"
                                                                    className="h-8 px-3 text-xs border-white/10 hover:bg-white/10"
                                                                >
                                                                    Next
                                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
