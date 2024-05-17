const http = require("https");
const jwt = require("jsonwebtoken");

function generatePDF(data, callback) {
    const apiKey = '17707ca395ef9e91fbcc35563a49fb9930be599128c97be79dd1b527dc443b4d';
    const apiSecret = '68d656da308b9a4d70a3d1b4cce867f0dac956f329872207eb1f1e8ffd950ec0';
    const payload = {
        iss: apiKey,
        sub: "220110431@psu.edu.sa",
        exp: Math.floor(Date.now() / 1000) + 3600  // Token expires in 1 hour
    };
    const token = jwt.sign(payload, apiSecret, { algorithm: 'HS256' });

    const options = {
        method: "POST",
        hostname: "us1.pdfgeneratorapi.com",
        path: "/api/v4/documents/generate",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const req = http.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            const responseJson = JSON.parse(body.toString()); // Parse the JSON response
            const pdfUrl = responseJson.response; // Access the URL
            callback(null, pdfUrl);  // Send the URL back to the client
        });
    });

    req.on("error", (e) => {
        callback(e, null);
    });

    req.write(JSON.stringify({
        template: { id: '1055772', data: data },
        format: 'pdf',
        output: 'url',
        name: 'Fraud Report'
    }));
    req.end();
}

module.exports = generatePDF;
