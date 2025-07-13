"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { InstallerRouteGuard } from "@/lib/routeGuard";
import { 
  getReviewsForInstaller
} from "@/lib/firebaseHelpers";
import { 
  Star, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  Filter,
  Calendar,
  User
} from "lucide-react";

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: Date;
  is_verified_purchase: boolean;
  helpful_count?: number;
  response?: string;
}

export default function InstallerReviewsPage() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getReviewsForInstaller(user.uid);
      // Patch: Normalize each review to match the Review interface
      const normalized = (reviewsData as any[]).map((r) => ({
        id: r.id || "",
        reviewer_name: r.reviewer_name || r.reviewer || "",
        reviewer_id: r.reviewer_id || "",
        rating: typeof r.rating === "number" ? r.rating : 0,
        comment: r.comment || "",
        created_at: r.created_at && typeof r.created_at.toDate === "function"
          ? r.created_at.toDate()
          : (r.created_at instanceof Date ? r.created_at : new Date()),
        is_verified_purchase: !!r.is_verified_purchase,
        helpful_count: typeof r.helpful_count === "number" ? r.helpful_count : 0,
        response: typeof r.response === "string" ? r.response : undefined,
      }));
      setReviews(normalized as Review[]);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRatingStats = () => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      ratingCounts[review.rating as keyof typeof ratingCounts]++;
    });
    
    return { total, average, ratingCounts };
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

  const stats = getRatingStats();

  if (loading) {
    return (
      <InstallerRouteGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
        </div>
      </InstallerRouteGuard>
    );
  }

  return (
    <InstallerRouteGuard>
      <div className="pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to customer reviews
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {stats.average.toFixed(1)}
                </div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-500 mb-2">{stats.total}</div>
                <div className="text-gray-600 text-sm">Total Reviews</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {stats.ratingCounts[5] + stats.ratingCounts[4]}
                </div>
                <div className="text-gray-600 text-sm">Positive Reviews</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {stats.ratingCounts[1] + stats.ratingCounts[2]}
                </div>
                <div className="text-gray-600 text-sm">Negative Reviews</div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ThumbsDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.ratingCounts[rating as keyof typeof stats.ratingCounts];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-16">
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-gray-600">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews List */}
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">
              {filterRating !== "all" 
                ? "Try adjusting your filters to see more results."
                : "Customer reviews will appear here once you complete installations."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.reviewer_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.created_at)}</span>
                        <span>•</span>
                        <span>{getTimeAgo(review.created_at)}</span>
                        {review.is_verified_purchase && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Verified Purchase</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
                
                {review.helpful_count && review.helpful_count > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful_count} people found this helpful</span>
                  </div>
                )}
                
                {review.response && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-900 mb-1">Your Response:</p>
                    <p className="text-sm text-blue-800">{review.response}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                    <MessageCircle className="w-4 h-4" />
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstallerRouteGuard>
  );
} 