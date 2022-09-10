const JWT_TOKEN = 'JWT_TOKEN';

function saveToken(tokenKey, content) {
  localStorage.setItem(tokenKey, content);
}

function extractToken(tokenKey = JWT_TOKEN) {
  return localStorage.getItem(tokenKey);
}

function removeToken(tokenKey = JWT_TOKEN) {
  localStorage.removeItem(tokenKey);
}

export default {
  saveToken,
  extractToken,
  removeToken,
  JWT_TOKEN,
};
