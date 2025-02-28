'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setRecommendationData(parsedData);
      } catch (error) {
        console.error('Error parsing recommendation data:', error);
      }
    }
  }, [searchParams]);

  if (!recommendationData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">Recommendation Results</h2>
        <div className="mb-4">
          <p className="block text-gray-700 text-sm font-bold mb-2">
            Recommended Energy Source: {recommendationData.recommended_source}
          </p>
          <p className="block text-gray-700 text-sm font-bold mb-2">
            Estimated Breakeven Point: {recommendationData.break_even_point}
          </p>
          <p className="block text-gray-700 text-sm font-bold mb-2">
            Estimated Long Term Savings: {recommendationData.total_savings}
          </p>
          <p className="block text-gray-700 text-sm font-bold mb-2">
            Recommended Local Suppliers: {recommendationData.local_suppliers}
          </p>
          <p className="block text-gray-700 text-sm font-bold mb-2">
            Reason For Recommendation: {recommendationData.reason_for_recommendation}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.push('/')}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}