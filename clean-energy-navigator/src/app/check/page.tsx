"use client";

import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const SustainabilityChecker = () => {
    const [productLink, setProductLink] = useState('');
    const [score, setScore] = useState(null);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/sustainability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productLink }),
            });

            const data = await response.json();

            if (response.ok) {
                setScore(data.score || null);
                setAnalysis(data.analysis || '');
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (err) {
            setError('Failed to fetch sustainability data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Product Sustainability Checker
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                            Enter a product link to analyze its environmental impact
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Paste product URL here..."
                                    value={productLink}
                                    onChange={(e) => setProductLink(e.target.value)}
                                    className="flex-1"
                                />
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="min-w-[140px]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Check Now'
                                    )}
                                </Button>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {score !== null && (
                                <div className="mt-8 space-y-6">
                                    <div className="bg-white rounded-lg p-4">
                                        <Plot
                                            data={[
                                                {
                                                    type: 'indicator',
                                                    mode: 'gauge+number',
                                                    value: score,
                                                    title: { text: 'Sustainability Score', font: { size: 24 } },
                                                    gauge: {
                                                        axis: { range: [0, 100], tickwidth: 1 },
                                                        bar: { color: score > 50 ? '#22c55e' : '#ef4444' },
                                                        bgcolor: 'white',
                                                        borderwidth: 2,
                                                        bordercolor: 'gray',
                                                        steps: [
                                                            { range: [0, 20], color: '#fee2e2' },
                                                            { range: [20, 40], color: '#fecaca' },
                                                            { range: [40, 60], color: '#fde68a' },
                                                            { range: [60, 80], color: '#bbf7d0' },
                                                            { range: [80, 100], color: '#86efac' }
                                                        ],
                                                        threshold: {
                                                            line: { color: 'black', width: 4 },
                                                            thickness: 0.75,
                                                            value: score
                                                        }
                                                    }
                                                }
                                            ]}
                                            layout={{
                                                width: 600,
                                                height: 400,
                                                margin: { t: 40, b: 40, l: 40, r: 40 },
                                                paper_bgcolor: 'white',
                                                font: { family: 'Inter, sans-serif' }
                                            }}
                                            config={{ responsive: true }}
                                        />
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-6">
                                        <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
                                        <div className="prose prose-gray max-w-none">
                                            {analysis.split('*').map((point, index) => 
                                                point.trim() && (
                                                    <p key={index} className="mb-3">
                                                        {point.trim()}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SustainabilityChecker;