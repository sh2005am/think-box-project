const apiUrl = import.meta.env.DEV
  ? '' // For local development
  : 'https://think-box-project.onrender.com'; // <-- Your live Render URL
export default apiUrl;
