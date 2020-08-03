async function searchVideoSuggestions(text) {
    return await (await fetch(`/search/autocomplete/${text}`)).json();
}

async function searchYoutubeVideos(q) {
    return await (await fetch(`/youtube/${q}`)).json();
}

export default {
    searchVideoSuggestions,
    searchYoutubeVideos
}