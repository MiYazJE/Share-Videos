async function searchVideoSuggestions(text) {
  const res = await fetch(`/api/v1/search/autocomplete/${text}`);
  return res.json();
}

async function searchYoutubeVideos(q) {
  const res = await fetch(`/api/v1/youtube/${q}`);
  return res.json();
}

async function createRoom(name) {
  const request = new Request('/api/v1/room/create', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const res = await fetch(request);
  return res.json();
}

async function isValidRoom(id) {
  const res = await fetch(`/api/v1/room/isValid/${id}`);
  return res.json();
}

async function register(payload) {
  const request = new Request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const res = await fetch(request);
  return res.json();
}

async function login(payload) {
  const request = new Request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const res = await fetch(request);
  return res.json();
}

async function whoAmI() {
  const res = await fetch('/api/v1/auth/whoAmI');
  return res.ok ? res.json() : null;
}

async function logout() {
  await fetch('/api/v1/auth/logout');
}

export default {
  searchVideoSuggestions,
  searchYoutubeVideos,
  createRoom,
  isValidRoom,
  register,
  login,
  whoAmI,
  logout,
};
