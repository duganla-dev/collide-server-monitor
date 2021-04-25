const WebSocket = require('ws');
const fs = require('fs');
const express = require('express')

const http = express()
const port = 80

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        if (!message.payload) { console.log('Received: %s : %s', ws.connectionRole, message);
        } else { console.log('Received: %s : %s', ws.connectionRole, "Has Payload") };
        
        
        if (message.type === "establish") {
            ws.connectionRole = "server";
            ws.clientInfo = {name: message.name, id: message.id};
            console.log("New Server Connection:", message.name, "\n")
        };

        if (message.type === "clientEstablish") {
            ws.connectionRole = "client"
            console.log("New Client Connection:")
        };


        if (message.type === "getServerList") {
            var serverList = []
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN && client.connectionRole == 'server') {
                    console.log(client.clientInfo)
                    serverList.push(client.clientInfo)
                }
            });
            ws.send(JSON.stringify({type: 'serverList', servers: serverList}))
        }

        if (message.type == 'getServerStats' && message.servers) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN && client.connectionRole == 'server') {
                    console.log(client.clientInfo)
                    client.send(JSON.stringify({type:"performance", client: true}))
                }
            });
        }

        if (message.type === "performance") {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN && client.connectionRole == 'client') {
                    client.send(JSON.stringify({type:"performance", server: ws.clientInfo, payload: message.payload}))
                }
            });
        }

    });
});


http.get('/', (req, res) => {
    res.sendFile(__dirname + '/server.html')
})

http.listen(port, () => {
    console.log(`Http Server Listening`)
})
