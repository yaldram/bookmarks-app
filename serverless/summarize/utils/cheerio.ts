import { load } from 'cheerio';
import fetch from 'node-fetch';

export async function fetchContent(link: string) {
    const webpageResponse = await fetch(link);
    const webpageBody = await webpageResponse.text();
    const $ = load(webpageBody);

    // remove un-necessary elements from the webpage
    $('script').remove();
    $('link').remove();
    $('style').remove();
    $('img').remove();
    $('svg').remove();
    $('noscript').remove();
    $('a').remove();

    const webpageText = $('body').text();

    // replace all the un-necessary line breaks, spaces, etc.
    const cleanedWebpageText = webpageText.replace(/\s+/g, ' ').trim();

    // take the first 3000 characters from the text
    return cleanedWebpageText.substring(0, 3000);
}
