export async function searchVideoSuggestions(text, maxResults = 8) {
    return await (await fetch(`/youtube/search/${text}/${maxResults}`)).json();
}