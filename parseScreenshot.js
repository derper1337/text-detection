const fs = require('fs')
const axios = require('axios')

const parseScreenshot = (fileName, screenShotName, iamToken) => {
    const file = fs.readFileSync(`./images/${screenShotName}`);
    const encoded = Buffer.from(file).toString('base64');
    const IAM = iamToken;
    const URL = 'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze\n'
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${IAM}`
        },
    };
    const data =
        {
            "folderId": "b1gfdmur71r0rkm8fkq1",
            "analyze_specs": [{
                "content": `${encoded}`,
                "features": [{
                    "type": "TEXT_DETECTION",
                    "text_detection_config": {
                        "language_codes": ["*"]
                    }
                }]
            }]
        }

    axios.post(URL, data, options).then((res) => {
        console.log(`statusCode: ` + res.status);
        let result = "";
        JSON.stringify(res.data, (key, value) => {
            if (key === "text") {
                result = result + ' ' + value;
            }
            return value;
        });
        fs.writeFile(`./texts/${fileName}`, result, (err) => {
            if (err) throw err;
        });
    })
}
module.exports = parseScreenshot;