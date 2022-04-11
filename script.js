// npm init -y
// npm install minimist
// npm install puppeteer
// npm install fs
// npm install image-clipper
// node script.js --url=url.json

let minimist = require('minimist');
let puppeteer = require('puppeteer');
let fs = require('fs');
const sharp = require('sharp');
let args = minimist(process.argv);

let urlJSON = fs.readFileSync(args.url, "utf-8");
let urlJSO = JSON.parse(urlJSON);

let targetURL = urlJSO.imgURL ;
console.log(targetURL);

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(targetURL);

    //get image div
    await page.waitForSelector(`div.KL4Bh > img`);
    let img = await page.$eval("div.KL4Bh > img", function(target){
       let imglink = target.getAttribute('src');
       return imglink;
    });
    console.log(img);
    await page.goto(img);
    await page.screenshot({ path: './bin/yourimg.png' });
    await browser.close();

    await cropImg();
  })();

// Cropping the image : === >
async function cropImg(){
    sharp('./bin/yourimg.png')
    .extract({ left: 100, top: 0, width: 600, height: 600 })
    .toFile('./yourDownloadedImg.jpg', function (err) {
        if (err) console.log(err);
    });
}


