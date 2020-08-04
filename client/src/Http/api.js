async function searchVideoSuggestions(text) {
    return await (await fetch(`/api/v1/search/autocomplete/${text}`)).json();
}

async function searchYoutubeVideos(q) {
    return await (await fetch(`/api/v1/youtube/${q}`)).json();
}

async function createRoom() {
    return await (await fetch('/api/v1/room/create')).json();
}

export default {
    searchVideoSuggestions,
    searchYoutubeVideos,
    createRoom
}