// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: "http://192.168.8.84:8000", // Your computer's IP address
  },
  production: {
    baseURL: "https://your-production-api.com", // Replace with your production URL
  },
  localhost: {
    baseURL: "http://localhost:8000", // For web development
  },
};

// Get the current environment
const getEnvironment = (): keyof typeof API_CONFIG => {
  // You can modify this logic based on your needs
  // For now, defaulting to development for mobile
  return "development";
};

export const getApiConfig = () => {
  const env = getEnvironment();
  return API_CONFIG[env];
};

export default API_CONFIG;
