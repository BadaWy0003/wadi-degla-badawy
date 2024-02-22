const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const data = require('./data.json');

const compile = async (templateName, data) => {

    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function (value, format) {

    return moment(value).format(format);
})

async function generatePDF(templateName, data, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    htmlContent = await compile(templateName, data);
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    await browser.close();
}



// generatePDF('invoice', data, 'invoice.pdf')
//     .then(() => console.log('PDF generated successfully'))
//     .catch(err => console.error('Error generating PDF:', err));

//     generatePDF('packing-list', data, 'packing-list.pdf')
//     .then(() => console.log('PDF generated successfully'))
//     .catch(err => console.error('Error generating PDF:', err));
    
    generatePDF('pricing-list', data, 'pricing-list.pdf')
    .then(() => console.log('PDF generated successfully'))
    .catch(err => console.error('Error generating PDF:', err));       