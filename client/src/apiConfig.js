const apiUrl = import.meta.env.DEV
  ? '/api' // For local development
  : 'https://think-box-api.onrender.com/api'; // <-- Your live Render URL
export default apiUrl;