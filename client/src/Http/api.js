export async function searchYoutubeVideo(text) {
    return await (await fetch(`/youtube/search/${text}`)).json();
}
