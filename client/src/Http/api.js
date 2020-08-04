import fetch from "node-fetch";

async function searchVideoSuggestions(text) {
    return await (await fetch(`/api/v1/search/autocomplete/${text}`)).json();
}

async function searchYoutubeVideos(q) {
    return await (await fetch(`/api/v1/youtube/${q}`)).json();
}

async function createRoom(name) {
    const request = new Request(
        '/api/v1/room/create',
        {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return await (await fetch(request)).json();
}

async function isValidRoom(id) {
    return await (await fetch(`/api/v1/room/isValid/${id}`)).json();
}

export default {
    searchVideoSuggestions,
    searchYoutubeVideos,
    createRoom,
    isValidRoom
}