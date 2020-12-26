async function searchVideoSuggestions(text) {
    return await (await fetch(`/api/v1/search/autocomplete/${text}`)).json();
}

async function searchYoutubeVideos(q) {
    return await (await fetch(`/api/v1/youtube/${q}`)).json();
}

async function createRoom(name) {
    const request = new Request('/api/v1/room/create', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await (await fetch(request)).json();
}

async function isValidRoom(id) {
    return await (await fetch(`/api/v1/room/isValid/${id}`)).json();
}

async function register(payload) {
    const request = new Request('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await (await fetch(request)).json();
}

async function login(payload) {
    const request = new Request('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await (await fetch(request)).json();
}

async function whoAmI() {
    const res = await fetch('/api/v1/auth/whoAmI');
    return res.ok ? await res.json() : null;
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
