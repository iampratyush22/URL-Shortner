"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Activity, Globe, MousePointerClick, Clock, UserCheck } from "lucide-react";

export default function AnalyticsDashboard() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.shortCode) {
            axios.get(`http://localhost:10000/analytic/${params.shortCode}`)
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
                No data found for this short code.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans transition-all">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Analytics Overview
                        </h1>
                        <p className="text-neutral-400 mt-2">
                            Real-time traffic data for <span className="text-white font-mono bg-neutral-800 px-2 py-1 rounded">/{data.shortCode}</span>
                        </p>
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
                        <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400">
                            <MousePointerClick size={28} />
                        </div>
                        <div>
                            <p className="text-neutral-400 text-sm font-medium">Total Clicks</p>
                            <h2 className="text-3xl font-bold text-white mt-1">{data.totalClicks}</h2>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
                        <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-400">
                            <Globe size={28} />
                        </div>
                        <div>
                            <p className="text-neutral-400 text-sm font-medium">Top Regions</p>
                            <h2 className="text-3xl font-bold text-white mt-1">
                                {data.countryStats?.[0]?.country || 'N/A'}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Chart area */}
                    <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-6 flex items-center">
                            <Activity className="mr-2 text-indigo-400" size={20} />
                            Traffic by Country
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.countryStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="country" stroke="#666" tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#666" tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#222' }}
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent activity list */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col max-h-[400px]">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center">
                            <Clock className="mr-2 text-cyan-400" size={20} />
                            Recent Activity
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {data.recentClicks?.map((click: any, idx: number) => (
                                <div key={idx} className="bg-neutral-800/50 p-4 rounded-2xl hover:bg-neutral-800 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-neutral-700 p-2 rounded-full">
                                                <UserCheck size={16} className="text-neutral-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-neutral-200">{click.ip}</p>
                                                <p className="text-xs text-neutral-500 mt-1 truncate" title={click.userAgent}>
                                                    {click.userAgent}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-xs font-semibold text-indigo-400">{click.country || 'Unknown'}, {click.city || 'Unknown'}</p>
                                            <p className="text-[10px] text-neutral-500 mt-1">
                                                {new Date(click.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.recentClicks || data.recentClicks.length === 0) && (
                                <p className="text-neutral-500 text-sm text-center mt-10">No recent clicks recorded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
