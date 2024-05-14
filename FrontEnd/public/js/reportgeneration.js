const http = require("https");

const options = {
    "method": "POST",
    "hostname": "us1.pdfgeneratorapi.com",
    "port": null,
    "path": "/api/v4/documents/generate",
    "headers": {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxNzcwN2NhMzk1ZWY5ZTkxZmJjYzM1NTYzYTQ5ZmI5OTMwYmU1OTkxMjhjOTdiZTc5ZGQxYjUyN2RjNDQzYjRkIiwic3ViIjoiMjIwMTEwNDMxQHBzdS5lZHUuc2EiLCJleHAiOjE3MTU3MTUxNDl9.gVevcm30mDkpFl1M2DDmBd7pFi4KCggZfXF8fZUnt9I"
    "Content-Type": "application/json",
    }
};

const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.write(JSON.stringify({
    template: {
        id: '1055771',
        data: { Name: 'MOHAMMAD MAROUF', DueDate: '2024-05-14' }
    },
    format: 'pdf',
    output: 'url',
    name: 'Certificate Example'
}));
req.end();