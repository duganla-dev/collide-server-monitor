const WebSocket = require('ws');
const fs = require('fs');
const express = require('express')

const http = express()
const port = 80

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        console.log('Received: %s', message);

        if (message.type === "establish") {
            console.log("New Server Connection:", message.name, "\n")
        };

        if (message.type === "clientEstablish") {
            console.log("New Client Connection:")
        };


    });
});


http.get('/', (req, res) => {
    res.sendFile(__dirname + '/server.html')
})

http.listen(port, () => {
    console.log(`Http Server Listening`)
})