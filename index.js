const requests = require("requests");
const http = require("http");
const fs = require("fs");

// chunk means thoda thoda load hona aur show hona
const homeFile = fs.readFileSync("index.html", "utf8");

const replaceVal = (tempVal, orgVal) => {
    let tempereture = tempVal.replace("{%tempval%}", orgVal.main.temp);
    tempereture = tempereture.replace("{%tempmin%}", orgVal.main.temp_min);
    tempereture = tempereture.replace("{%tempmax%}", orgVal.main.temp_max);
    tempereture = tempereture.replace("{%location%}", orgVal.name);
    tempereture = tempereture.replace("{%country%}", orgVal.sys.country);
    tempereture = tempereture.replace("{<%tempStatus%>}", orgVal.weather[0].main);
    return  tempereture;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=london&appid=03d2ba06cfce16091e4c23d3a483403d")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata]
                //   console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");
                 res.write(realTimeData);
               // console.log(realTimeData);
                })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});



server.listen(8000, "127.0.0.1");
