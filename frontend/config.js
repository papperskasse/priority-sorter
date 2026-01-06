// API Configuration
// This will automatically use the correct API URL based on environment

function getApiUrl() {
    // Check if we're in production (deployed)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Production API URL - Update this after deploying your backend
        return window.location.protocol + '//' + 
               (localStorage.getItem('API_URL') || 'YOUR_RENDER_APP_URL.onrender.com');
    }
    // Local development
    return 'http://localhost:8000';
}

const API_BASE_URL = getApiUrl();

// Allow users to update the API URL from the browser console
window.setApiUrl = function(url) {
    localStorage.setItem('API_URL', url);
    window.location.reload();
};

console.log('API URL:', API_BASE_URL);
