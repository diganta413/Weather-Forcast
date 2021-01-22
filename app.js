const express=require("express");
const body=require("body-parser");
const fs=require("fs");
const http=require("http");
var path = require('path');


const app=express();

var temp="";
var des="";
var city_name="";
var src="";
var cn="";
var temp_max="";
var temp_min="";

app.use(express.static(path.join(__dirname, 'public')));
app.use(body.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/",(req,res)=>{
    var city=req.body.city;
    var country=req.body.country;
    var date = new Date();
    var rawdata=fs.readFileSync("public/keys.json");
    var keys=JSON.parse(rawdata);
    var api_key=keys.api_key;
    var url="http://api.openweathermap.org/data/2.5/weather?units=metric&q="+ city +","+country+"&appid=";
    http.get(url+api_key,(response)=>{
        console.log(response.statusCode);
        response.on("data",(data)=>{
            var s=JSON.parse(data);
            temp=s.main.temp;
            city_name=city;
            temp_max=s.main.temp_max;
            temp_min=s.main.temp_min;
            cn=country;
            console.log(s);
            des=s.weather[0].main;
            src=des+".png";
            console.log(src);
            res.redirect("/weather");
            
        })
    })
})

app.get("/weather",(req,res)=>{
    res.render("weather",{temp: temp,city: city_name,des: des,src: src,country: cn,temp_max: temp_max,temp_min: temp_min});
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("Port 3000");
})