var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

var moment = require('moment');
var ko = require('knockout');
var request = require("request");
var asyncForEach = require('async-foreach').forEach;
var cheerio = require('cheerio');
var fs = require('fs');
var jsonfile = require('jsonfile');

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

var euro = 1;

request({
    url: "https://api.myjson.com/bins/119upp",
    json: true
}, function (error, response, body) {
    if(!error){
        euro = body.euro;
    }
});

app.set('view engine', 'ejs');

var searchString = "lore%2Bgamma%2Bcrimson%2Bhowl%2Bmedusa%2Bautotronic%2Btiger%2Bserpent%2Bmarble_fade&category_730_Exterior%5B%5D=tag_WearCategory0&category_730_Exterior%5B%5D=tag_WearCategory1&category_730_Exterior%5B%5D=tag_WearCategory2&category_730_Weapon%5B%5D=tag_weapon_ak47&category_730_Weapon%5B%5D=tag_weapon_awp&category_730_Weapon%5B%5D=tag_weapon_m4a1&category_730_Weapon%5B%5D=tag_weapon_bayonet&category_730_Weapon%5B%5D=tag_weapon_knife_karambit&category_730_Weapon%5B%5D=tag_weapon_knife_m9_bayonet";

var allItemsFromServer = [{ "item": "★ Karambit | Gamma Doppler (Factory New)", "price": "600", "csgofast": "554.82", "autobuy": true }, { "item": "★ Karambit | Lore (Minimal Wear)", "price": "500", "csgofast": "705.99", "autobuy": true }, { "item": "★ Karambit | Lore (Factory New)", "price": "600", "csgofast": "1158.25", "autobuy": true }, { "item": "★ M9 Bayonet | Lore (Minimal Wear)", "price": "600", "csgofast": "714.07", "autobuy": true }, { "item": "★ M9 Bayonet | Lore (Factory New)", "price": "600", "csgofast": "970.85", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Minimal Wear)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Lore (Minimal Wear)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Lore (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "AWP | Dragon Lore (Field-Tested)", "price": "600", "csgofast": "752.51", "autobuy": true }, { "item": "AWP | Dragon Lore (Minimal Wear)", "price": "600", "csgofast": "942.08", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Crimson Web (Minimal Wear)", "price": "600", "csgofast": "480.14", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Crimson Web (Factory New)", "price": "600", "csgofast": "", "autobuy": true }, { "item": "M4A4 | Howl (Minimal Wear)", "price": "500", "csgofast": "374.61", "autobuy": true }, { "item": "M4A4 | Howl (Factory New)", "price": "500", "csgofast": "624.36", "autobuy": true }, { "item": "AWP | Medusa (Minimal Wear)", "price": "500", "csgofast": "477.60", "autobuy": true }, { "item": "AWP | Medusa (Factory New)", "price": "500", "csgofast": "878.21", "autobuy": true }, { "item": "AWP | Dragon Lore (Factory New)", "price": "500", "csgofast": "1414.18", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Field-Tested)", "price": "500", "csgofast": "775.57", "autobuy": true }, { "item": "★ Karambit | Autotronic (Factory New)", "price": "500", "csgofast": "748.76", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Autotronic (Minimal Wear)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Gamma Doppler (Factory New)", "price": "500", "csgofast": "965.77", "autobuy": true }, { "item": "★ StatTrak™ M9 Bayonet | Marble Fade (Factory New)", "price": "500", "csgofast": "507.63", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Tiger Tooth (Factory New)", "price": "500", "csgofast": "506.79", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Marble Fade (Factory New)", "price": "500", "csgofast": "575.32", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Fade (Factory New)", "price": "500", "csgofast": "484.37", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Factory New)", "price": "500", "csgofast": "1568.51", "autobuy": true }, { "item": "StatTrak™ M4A4 | Howl (Minimal Wear)", "price": "500", "csgofast": "1048.44", "autobuy": true }, { "item": "★ M9 Bayonet | Crimson Web (Factory New)", "price": "500", "csgofast": "3203.45", "autobuy": true }, { "item": "★ Karambit | Crimson Web (Factory New)", "price": "500", "csgofast": "1651.19", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Lore (Factory New)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "StatTrak™ M9 Bayonet | Gamma Doppler (Factory New)", "price": "500", "csgofast": "", "autobuy": true }, { "item": "AK-47 | Fire Serpent (Factory New)", "price": "500", "csgofast": "505.37", "autobuy": true }, { "item": "StatTrak™ AK-47 | Fire Serpent (Field-Tested)", "price": "500", "csgofast": "677.78", "autobuy": true }, { "item": "StatTrak™ AK-47 | Fire Serpent (Minimal Wear)", "price": "500", "csgofast": "914.06", "autobuy": true }, { "item": "★ Karambit | Marble Fade (Factory New)", "price": "340", "csgofast": "323.01", "autobuy": true }, { "item": "★ StatTrak™ Karambit | Fade (Factory New)", "price": "500", "csgofast": "484.37", "autobuy": true }];

var ifERROR = false;
var refreshTime = 12000;
var knifes = [];
var startTime = 9;

io.on('connection', function (socket) {
    socket.send("connect");
    socket.on('disconnect', function () {
    });
});

var refresh = setInterval(function () {
     if (((moment().seconds()<10?'0':'') + moment().seconds()).substring(1) == startTime) {
        refreshFunction()
        clearInterval(refresh);
    }
}, 100);

function refreshFunction() {
    asyncForEach([1], function () {
        getitemsPrice();
        var done = this.async();
        setTimeout(done, refreshTime);
    }, function done() {
        if (ifERROR) {
            setTimeout(function () {
                refreshFunction();
            }, refreshTime);
        }
        else {
            refreshFunction();
        }
    });
};

function getitemsPrice() {
    ifERROR = false;
    request({
        url: "http://steamcommunity.com/market/search/render/?currency=3&appid=730&start=0&count=100&query=" + searchString,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
                    var $ = cheerio.load(body.results_html);                  
                    knifes = [];
                    var price = [];
                    
                    $(".market_listing_searchresult .market_listing_item_name").each(function (index) {
                        knifes[index] = { "item": $(this).text() };
                    });

                    $(".normal_price").not('.market_table_value').each(function (index) {
                         price[index] = { "price": (parseInt($(this).text().substr(1)) * euro).toFixed(2)};
                    });

                    for(var i=0; i < knifes.length; i++){
                        for(var j=0; j < allItemsFromServer.length; j++){
                            if (knifes[i].item == allItemsFromServer[j].item) {
                                console.log('pojavio se noz!');
                                if(price[i].price <= allItemsFromServer[j].price){
                                    io.emit('hello', { text: "http://steamcommunity.com/market/listings/730/" + encodeURIComponent(knifes[i].item), img: "", tobuy: knifes[i].autobuy });   
                                }
                                else{
                                    io.emit('hello', { text: "http://steamcommunity.com/market/listings/730/" + encodeURIComponent(knifes[i].item), img: "", tobuy: false });   
                                }       
                                request({ url: 'https://api.myjson.com/bins/3d1jx', method: 'PUT', json: {item: knifes[i].item, time: new Date(), price: price[i].price}}, function(){});
                            }
                        }
                    }
                    console.log('ok');
                    io.emit('alert', "ok: " + startTime);
        };
        if (response.statusCode === 429 || error) {
            ifERROR = true;
            console.log('error');
            io.emit('alert', "error: " + startTime);
        }
    });
}

http.listen(PORT, function () {
    console.log('listen', PORT);
})