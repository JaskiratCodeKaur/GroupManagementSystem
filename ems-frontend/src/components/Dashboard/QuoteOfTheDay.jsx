import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.realinspire.live/v1/quotes/random');
        if (response.data && response.data[0]) {
          setQuote(response.data[0]);
        }
      } catch (err) {
        console.error('Quote fetch error:', err);
        setError('Failed to fetch quote.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-start">
        <div className="bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 p-6 rounded-lg shadow-md my-4 w-[70%]">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Loading inspiring quote...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-start">
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg shadow-md my-4 w-[70%] border border-red-300 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start">
      <blockquote className="bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 p-6 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800/30 my-4 w-[70%] text-left transition-colors">
        <p className="text-lg italic mb-2 text-gray-800 dark:text-gray-200">"{quote?.content || 'Stay positive and keep moving forward.'}"</p>
        <footer className="text-right font-semibold text-gray-700 dark:text-gray-300">— {quote?.author || 'Unknown'}</footer>
      </blockquote>
    </div>
  );
};

export default QuoteOfTheDay;
