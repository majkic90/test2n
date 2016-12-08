var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

var moment = require('moment');
var ko = require('knockout');
var request = require("request");
var asyncForEach = require('async-foreach').forEach;
var jsdom = require('jsdom');
var fs = require('fs'),
    jsonfile = require('jsonfile');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
    socket.send("connect");
    socket.on('disconnect', function () {
    });
});

var searchString = "lore%2Bgamma%2Bcrimson%2Bhowl%2Bmedusa%2Bautotronic%2Btiger%2Bserpent%2Bmarble_fade&category_730_Exterior%5B%5D=tag_WearCategory0&category_730_Exterior%5B%5D=tag_WearCategory1&category_730_Exterior%5B%5D=tag_WearCategory2&category_730_Weapon%5B%5D=tag_weapon_ak47&category_730_Weapon%5B%5D=tag_weapon_awp&category_730_Weapon%5B%5D=tag_weapon_m4a1&category_730_Weapon%5B%5D=tag_weapon_bayonet&category_730_Weapon%5B%5D=tag_weapon_knife_karambit&category_730_Weapon%5B%5D=tag_weapon_knife_m9_bayonet"

var ifERROR = false,
    refreshTime = 10000;

var allItemsFromServer = [];

var euro = 1;

request({
    url: "https://api.myjson.com/bins/1lf9x",
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
    allItemsFromServer  = body;
                var refresh = setInterval(function () {
                    //krece na 1. sekundu da radi
					if (moment().seconds() == 6) {
						refreshFunction()
						clearInterval(refresh);
					}
				}, 100);
    }
})

function refreshFunction() {
    asyncForEach([1], function () {
        getitemsPrice();
        var done = this.async();
        setTimeout(done, refreshTime);
    }, function done() {
        if (ifERROR) {
            setTimeout(function () {
                refreshFunction();
            }, 15000);
        }
        else {
            refreshFunction();
        }
    });
};

function getitemsPrice() {
    ifERROR = false;
    request({
        url: "http://steamcommunity.com/market/search/render/?country=RS&language=english&currency=3&appid=730&start=0&count=100&query=" + searchString + "&format=json",
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
        
        var test = body.results_html;
        jsdom.env(test,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
            var $ = window.jQuery;
            var knifes = [];

            $( ".market_listing_searchresult .market_listing_item_name" ).each(function( index ) {
            //dobiju se imena svih skinova
            knifes[index] = { "item": $( this ).text()};
            });

            knifes.forEach(function (data, index) {
                    allItemsFromServer.forEach(function (value, index) {
                        if (data.item == value.item) {
                                console.log('pojavio se');
                                io.emit('hello', { text: "http://steamcommunity.com/market/listings/730/" + encodeURIComponent(value.item), img: "", tobuy: value.autobuy });
                                $.ajax({
                                    url:"https://api.myjson.com/bins/3d1jx",
                                    type:"POST",
                                    data:'{"item":' + value.item + '}',
                                    contentType:"application/json; charset=utf-8",
                                    dataType:"json",
                                    success: function(data, textStatus, jqXHR){
                                    }
                                });     
                        }
                    })
                });
            console.log('ok');
            io.emit('alert', "ok");
            }
        );
        }

        if (response.statusCode === 429) {
            ifERROR = true;
            console.log('error');
            io.emit('alert', "error");
        }
        if (error) {
            ifERROR = true;
            console.log('error');
            io.emit('alert', "error");
        }
    });

}


http.listen(PORT, function(){
    console.log('listen' , PORT);
})