export async function searchVideoSuggestions(text) {
    return await (await fetch(`/search/autocomplete/${text}`)).json();
}

export async function searchYoutubeVideos(q) {
    return await (await fetch(`/youtube/${q}`)).json();
}