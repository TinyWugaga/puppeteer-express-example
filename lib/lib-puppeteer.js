const puppeteer = require('puppeteer');

const clickLink = async (page, link) => {
    const response = await Promise.all([
        page.waitForNavigation(),
        link.click(`a[href*='${link}']`),
    ]);

    return response
}

/**
* =============================================================================
* = Discography
* =============================================================================
**/

const fetchAllDiscography = async () => {

    const getLatestDiscographyId = async (page) => {
        await page.goto('https://got7.jype.com/discography.asp');
        await page.waitForSelector('#album-list');

        const latestId = await page.$eval('#album-list ul li a', el => {
            return el.href.match(/(?<=(idx=))\d*/g);
        });

        return latestId[0];
    }

    const getAllDiscographyLinks = async (latestDiscographyId) => {
        return Array(+latestDiscographyId).fill().map((n, index) => {
            const id = index + 1;
            return `https://got7.jype.com/discography.asp?idx=${id}&page=`
        });
    }

    const getDiscography = async (page, link) => {
        await page.goto(link);
        await page.waitForSelector('#album-list');

        const discographyTitle = getDiscographyTitle(page);

        return discographyTitle;
    }

    const getDiscographyTitle = async (page) => {
        const discographyTitle = page.evaluate(() => {
            const albumTitle = document.querySelector('div.album-title');

            return {
                title: albumTitle.querySelector('h2').innerText,
                date: albumTitle.querySelector('p').innerText,
                img: document.querySelector('#sect-main > div.fullbox > div.box-l > img').src
            };
        });

        return discographyTitle
    }

    const getDiscographyList = async (page) => {
        const latestDiscographyId = await getLatestDiscographyId(page);
        const discographyLinks = await getAllDiscographyLinks(latestDiscographyId)

        const discographyList = [];
        for (var link of discographyLinks) {
            const discography = await getDiscography(page, link);
            discographyList.push(discography);
        }

        return discographyList
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const discographyList = await getDiscographyList(page);

    await browser.close();
    console.log(`discography list:`, discographyList);

    return discographyList
};

module.exports = fetchAllDiscography;