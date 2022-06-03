const parseScreenshot = require("./parseScreenshot")
const http = require("http");
const screenshot = require('desktop-screenshot');
const getRandomName= require("./randomName")
const fs = require("fs");
const axios = require("axios");
let auth;

const createToken =  async (oauth_token) =>{
    const auth = oauth_token;
    const params = {'yandexPassportOauthToken': auth}
    const response = await axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', params)
    console.log("token generated, expires at: " + response.data.expiresAt)
    return await response.data.iamToken;
}

createToken(auth).then(iamToken=>{
    const server = http.createServer((req, res) => {
        if (req.url === "/make") {
            const name = getRandomName();
            const fileName = name + '.txt';
            const screenShotName = name + '.png';
            screenshot(`./images/${screenShotName}`, (err) => {
                if (err) console.log(err)
                else {
                    console.log(fileName);
                    parseScreenshot(fileName, screenShotName, iamToken);
                }
            })
        }
        fs.readFile('./index.html', (err, html)=>{
            if (err) console.log(err)
            res.end(html);
        })
    });

    server.listen(8080, () => {
        console.log("server working on 8080");
    })
})

