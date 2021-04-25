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



function getSpecs(cb) {
    si.mem(mem => {
        si.currentLoad(cl => {
            cb({mem: mem, load: cl})
        })
    })    
}

const ws = new WebSocket(`ws://${config[0]}:${config[1]}/`, {
  perMessageDeflate: false
});

ws.on('open', function open() {
    console.log("WS", "Open")
    ws.send(JSON.stringify({type: "establish", message: "GS", name: config[2], id:config[3] }));
});
  
ws.on('message', function incoming(data) {
    data = JSON.parse(data)
    console.log(data);

    if (data.type === "performance") {
        getSpecs(specs => {
            specs = JSON.stringify({mem: specs.mem, load: specs.load})
            ws.send(JSON.stringify({type: 'performance', payload: specs, client: data.client} ))
        })
    }

    if (data.type === "system") {
        ws.send()
    }

});
