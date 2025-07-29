const apiUrl = import.meta.env.DEV
  ? '/api' // Development URL (uses the proxy)
  : 'https://your-live-backend-api.onrender.com/api'; // Production URL (replace this later)

export default apiUrl;