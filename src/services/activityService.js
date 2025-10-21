import api from "./api";

/**
 * Service for fetching activity logs
 */
const activityService = {
  /**
   * Get recent activity logs
   * @param {number} limit - Maximum number of activities to return
   * @param {string} type - Optional activity type filter
   * @returns {Promise} Promise with recent activities
   */
  getRecentActivity: async (limit = 10, type = null) => {
    try {
      let endpoint = `/activity?limit=${limit}`;
      if (type) {
        endpoint += `&type=${type}`;
      }

      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

  /**
   * Get activity logs for a specific date
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @param {number} limit - Maximum number of activities to return
   * @returns {Promise} Promise with activities for the date
   */
  getActivityForDate: async (dateString, limit = 10) => {
    try {
      const endpoint = `/activity/date/${dateString}?limit=${limit}`;
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching activity for date ${dateString}:`, error);
      throw error;
    }
  },
};

export default activityService;
