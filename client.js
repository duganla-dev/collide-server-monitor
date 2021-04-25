const fs = require('fs')
const si = require('systeminformation');
const WebSocket = require('ws');
const config = fs.readFileSync("config.txt",{encoding:'utf8', flag:'r'}).split('\r\n')
console.log(config)

function average(value) {
    var total = 0;
    for(var i = 0; i < value.length; i++) {
        total += value[i];
    }
    return total / value.length;
}


console.log(si.time())

si.system(data => {
    //console.log(data)
})

si.bios(data => {
    //console.log(data)
})


si.baseboard(data => {
    //console.log(data)
})

si.chassis(data => {
    //console.log(data)
})

si.memLayout(data => {
    //console.log(data)
})

si.mem(data => {
    //console.log(data)
})


si.currentLoad(data => {
    //console.log("currentLoad", data)
})


const ws = new WebSocket(`ws://${config[0]}:${config[1]}/`, {
  perMessageDeflate: false
});

ws.on('open', function open() {
    console.log("WS", "Open")
    ws.send(JSON.stringify({type: "establish", message: "GS", name: config[2] }));
});
  
ws.on('message', function incoming(data) {
    console.log(data);
});
