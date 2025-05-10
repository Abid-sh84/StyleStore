import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Star } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  username?: string; // Added for backward compatibility
  rating: number;
  comment: string;
  product_id: string;
  created_at: string;
}

const Reviews = ({ productId }: { productId: string }) => {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Fetch reviews error:", error.message);
      setError("Failed to load reviews");
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!userName.trim() || !rating || !comment.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newReview = {
        username: userName, // Using 'user' instead of 'username' to match your display
        rating,
        comment,
        product_id: productId,
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert([newReview])
        .select(); // Returns the inserted record

      if (error) throw error;

      setUserName("");
      setRating(0);
      setComment("");
      setReviews([data[0], ...reviews]); // Optimistic update
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to submit review");
      await fetchReviews(); // Fallback refresh
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
        Customer Reviews
      </h2>

      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Write a Review</h3>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all mb-3"
        />
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm text-gray-600">Rating:</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 rounded-full transition-colors ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all mb-3"
          rows={4}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.user || review.username}
                  </h4>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;