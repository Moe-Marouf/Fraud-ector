const http = require("https");
const jwt = require("jsonwebtoken");

function generatePDF(data, callback) {
    // Your API key and secret (do not store secrets directly in code in production)
    const apiKey = '17707ca395ef9e91fbcc35563a49fb9930be599128c97be79dd1b527dc443b4d';
    const apiSecret = '68d656da308b9a4d70a3d1b4cce867f0dac956f329872207eb1f1e8ffd950ec0';

    // Prepare the JWT payload
    const payload = {
        iss: apiKey,
        sub: "220110431@psu.edu.sa",  // Change this to your workspace identifier if necessary
        exp: Math.floor(Date.now() / 1000) + 60 * 60  // Token expiration time (1 hour)
    };

    // Sign the JWT
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
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
            callback(null, body.toString());  // Send the response body back to the caller
        });
    });

    req.on("error", (e) => {
        console.error("Error with PDF generation request: ", e);
        callback(e);
    });

    req.write(JSON.stringify({
        template: {
            id: '1055771',
            data: data,
        },
        format: 'pdf',
        output: 'url',
        name: 'Certificate Example'
    }));
    req.end();
}

module.exports = generatePDF;

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxNzcwN2NhMzk1ZWY5ZTkxZmJjYzM1NTYzYTQ5ZmI5OTMwYmU1OTkxMjhjOTdiZTc5ZGQxYjUyN2RjNDQzYjRkIiwic3ViIjoiMjIwMTEwNDMxQHBzdS5lZHUuc2EiLCJleHAiOjE3MTU3MTUxNDl9.gVevcm30mDkpFl1M2DDmBd7pFi4KCggZfXF8fZUnt9I
