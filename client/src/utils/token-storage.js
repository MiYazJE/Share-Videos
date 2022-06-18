const JWT_TOKEN = 'JWT_TOKEN';

function saveToken(tokenKey, content) {
  localStorage.setItem(tokenKey, content);
}

function extractToken(tokenKey = JWT_TOKEN) {
  return localStorage.getItem(tokenKey);
}

export default {
  saveToken,
  extractToken,
  JWT_TOKEN,
};
