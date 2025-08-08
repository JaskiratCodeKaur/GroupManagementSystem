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
        setQuote(response.data[0]);
      } catch (err) {
        setError('Failed to fetch quote.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) return <p>Loading quote...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full flex justify-start">
      <blockquote className="bg-indigo-100 p-6 rounded-lg shadow-md my-4 w-[70%] text-left">
        <p className="text-lg italic mb-2">"{quote.content}"</p>
        <footer className="text-right font-semibold">— {quote.author || 'Unknown'}</footer>
      </blockquote>
    </div>
  );
};

export default QuoteOfTheDay;
