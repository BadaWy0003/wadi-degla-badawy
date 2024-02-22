const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

const compile = async (templateName, data) => {

    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}


async function generatePDF(templateName, data, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    htmlContent = await compile(templateName, data);
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    await browser.close();
}

module.exports = {generatePDF};