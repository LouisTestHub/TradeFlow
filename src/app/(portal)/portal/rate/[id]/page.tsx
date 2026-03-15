'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function RateJobPage() {
  const params = useParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const jobTitle = 'Emergency Leak Repair'; // Demo data

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/portal" className="text-2xl">
              ← 🔧
            </a>
            <span className="font-bold text-xl text-primary">TradeFlow</span>
            <span className="text-sm text-slate-500 ml-2">Rate Job</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-6">Your feedback helps us improve our service.</p>
            <a
              href="/portal"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Back to Dashboard
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">How was your experience?</h1>
            <p className="text-slate-600 mb-6">Rate your recent job: {jobTitle}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Overall Rating *
                </label>
                <div className="flex gap-2 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-5xl transition-all hover:scale-110 ${
                        star <= rating ? 'opacity-100' : 'opacity-30 grayscale'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-slate-600 mt-2">
                    {rating === 5 && '🎉 Excellent!'}
                    {rating === 4 && '😊 Very Good!'}
                    {rating === 3 && '👍 Good'}
                    {rating === 2 && '😐 Could be better'}
                    {rating === 1 && '😞 Needs improvement'}
                  </p>
                )}
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={rating === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                    rating === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  Submit Rating
                </button>
                <a
                  href="/portal"
                  className="px-6 py-3 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Skip
                </a>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
