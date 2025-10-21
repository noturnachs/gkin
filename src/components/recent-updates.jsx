import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import recentUpdatesService from "../services/recentUpdatesService";
import {
  SingleUpdate,
  LoadingState,
  ErrorState,
  EmptyState,
} from "./updates/update-components";

/**
 * RecentUpdates component
 * @param {Object} props - Component props
 * @param {number} props.limit - Maximum number of updates to display
 */
export function RecentUpdates({ limit = 5 }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);

    try {
      const recentUpdates = await recentUpdatesService.getAllRecentUpdates(
        limit
      );
      setUpdates(recentUpdates);
    } catch (error) {
      console.error("Failed to fetch recent updates:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [limit]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={fetchUpdates} />;
  if (updates.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      {updates.map((update) => (
        <SingleUpdate key={update.id} update={update} />
      ))}

      {updates.length > 0 && (
        <Link
          to="/all-updates"
          className="block w-full text-center text-xs text-blue-600 hover:text-blue-700 py-1 hover:underline"
        >
          View all updates
        </Link>
      )}
    </div>
  );
}
