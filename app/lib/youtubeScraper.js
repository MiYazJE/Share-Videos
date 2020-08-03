const puppeteer = require('puppeteer');

let browser, page;
(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
})();

module.exports = {
    scrapVideosWithQuery,
};

async function scrapVideosWithQuery(query) {
    await page.goto(`https://www.youtube.com/results?search_query=${query}`, { waitUntil: 'networkidle0' });
    const videos = await page.evaluate(() => {
        return [...document.querySelectorAll('ytd-video-renderer')].map((el) => {
            const title = el.querySelector('#video-title').innerText;
            const urlThumbnail = el.querySelector('#img').getAttribute('src');
            const url = el.querySelector('#thumbnail').getAttribute('href');
            return { title, urlThumbnail, url };
        });
    });
    return videos;
}
