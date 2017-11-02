var http = require("http");
//variables
var game;
var weather;
//get weather
function get_weather(gameid){
var new_path = "/weather/api/report/" + gameid
var weatheroptions = {
  "method": "GET",
  "hostname": "www.dragonsofmugloar.com",
  "path": new_path
};

var weatherreq = http.request(weatheroptions, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    var str = body.toString();
    var codeindex = str.search("code");
    str = str.slice(codeindex+5,str.length);
    codeindex = str.search("<");
    str = str.slice(0,codeindex);
    weather = str;

    summon_dragon();	
  });
});

weatherreq.end();
}
//get game
function get_game(){
var options = {
  "method": "GET",
  "hostname": "www.dragonsofmugloar.com",
  "path": "/api/game"
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    game = JSON.parse(body.toString());
    get_weather(game.gameId);
  });
});

req.end();
}

//train your dragon
function summon_dragon(){
	var json = {dragon:{}};
	var points = 20;
	var knight = [game.knight.attack,game.knight.armor,game.knight.agility,game.knight.endurance];
	var maxindex = knight.indexOf(Math.max(...knight));
	if(maxindex == 0){
	json.dragon.scaleThickness = game.knight.attack+2;
	points-= json.dragon.scaleThickness;	
	json.dragon.clawSharpness = game.knight.armor;
	if(knight[1] != 0){
		json.dragon.clawSharpness-=1;	
	}
	points-= json.dragon.clawSharpness;
	json.dragon.wingStrength = game.knight.agility;
	if(knight[2] != 0){
		json.dragon.wingStrength-=1;	
	}
	points-= json.dragon.wingStrength;
	json.dragon.fireBreath = points;
	}

	else if(maxindex == 1){	
	json.dragon.scaleThickness = game.knight.attack;
if(knight[0] != 0){
		json.dragon.scaleThickness-=1;	
	}
	points-= json.dragon.scaleThickness;
	json.dragon.clawSharpness = game.knight.armor+2;
	points-= json.dragon.clawSharpness;
	json.dragon.wingStrength = game.knight.agility;
if(knight[2] != 0){
		json.dragon.wingStrength-=1;	
	}
	points-= json.dragon.wingStrength;
	json.dragon.fireBreath = points;
	}
	else if(maxindex == 2){	
	json.dragon.scaleThickness = game.knight.attack;
	if(knight[0] != 0){
		json.dragon.scaleThickness-=1;	
	}
	points-= json.dragon.scaleThickness;
	json.dragon.clawSharpness = game.knight.armor;
	if(knight[1] != 0){
		json.dragon.clawSharpness-=1;	
	}
	points-= json.dragon.clawSharpness;
	json.dragon.wingStrength = game.knight.agility+2;
	points-= json.dragon.wingStrength;
	json.dragon.fireBreath = points;
	}
	else if(maxindex == 3){	
	json.dragon.fireBreath = game.knight.endurance+2;
	points-= json.dragon.fireBreath;
	json.dragon.clawSharpness = game.knight.armor;
	if(knight[1] != 0){
		json.dragon.clawSharpness-=1;	
	}
	points-= json.dragon.clawSharpness;
	json.dragon.wingStrength = game.knight.agility;
	if(knight[2] != 0){
		json.dragon.wingStrength-=1;	
	}
	points-= json.dragon.wingStrength;
	json.dragon.scaleThickness = points;
	}

	send_dragon(json);
}

//send dragon to battle
function send_dragon(json){
var newpath= "/api/game/"+game.gameId+"/solution";
var options = {
  "method": "PUT",
  "hostname": "www.dragonsofmugloar.com",
  "port": null,
  "path":newpath,
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "postman-token": "f2cb4503-7cbc-70dc-930d-3fafce93d54b"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    var endwar = JSON.parse(body.toString());
    console.log(endwar.status+","+weather+",dragonstats:"+json.dragon.scaleThickness+","+json.dragon.clawSharpness+","+json.dragon.wingStrength+","+json.dragon.fireBreath+",gameid:"+game.gameId);
  });
});

req.write(JSON.stringify(json));
req.end();
}
setInterval(()=>{get_game();},500);
