/**
 * Created by p5030 on 2017/7/12.
 */
var locations = {

};
var locationsCoords= {
    "Keelung_City":[25.1276033,121.73918329999992],
    "Taipei_City":[25.0329694,121.56541770000001],
    "New_Taipei_City":[25.0169826,121.4627868],
    "Taoyuan_City":[24.9936281,121.30097980000005],
    "Hsinchu_City":[24.8138287,120.96747979999998],
    "Miaoli_County":[24.5711502,120.81543579999993],
    "Taichung_City":[24.1477358,120.6736482],
    "Chungha_City":[24.0517963,120.51613520000001],
    "Nantou_County":[23.9609981,120.97186379999994],
    "Yunlin_County":[23.7092033,120.4313373],
    "Chiayi_City":[23.4800751,120.44911130000003],
    "Chiayi_County":[
        23.4518428,120.25546150000002
    ],
    "Tainan_City":[
        22.9997281,120.22702770000001
    ],
    "Kaohsiung_City":[22.6272784,120.30143529999998],
    "Pingtung_County":[22.5519759,120.5487597],
    "Hualien_County":[23.9871589,121.60157140000001],
    "Taitung_County":[22.7972447,121.07137020000005],
    "Yilan_County":[24.7021073,121.73775019999994],
    "Kinmen_County":[24.3339636,119.4131185]
};
var CityList={
    "Keelung_City":"基隆市",
    "Taipei_City":"臺北市",
    "New_Taipei_City":"新北市",
    "Taoyuan_City":"桃園市",
    "Hsinchu_City":"新竹市",
    "Miaoli_County":"苗栗縣",
    "Taichung_City":"台中市",
    "Chungha_City":"彰化縣",
    "Nantou_County":"南投縣",
    "Yunlin_County":"雲林縣",
    "Chiayi_City":"嘉義市",
    "Chiayi_County":"嘉義縣",
    "Tainan_City":"臺南市",
    "Kaohsiung_City":"高雄市",
    "Pingtung_County":"屏東縣",
    "Hualien_County":"花蓮縣",
    "Taitung_County":"台東縣",
    "Yilan_County":"宜蘭縣",
    "Kinmen_County":"金門縣"
};
var backGroundList = {
  "atomsphere":"atomsphere.jpg",
  "breeze":  "breeze.jpg",
  "calm":"calm.jpg",
  "cloudy":"cloudy.jpg",
    "Overcast":"cloudy.jpg",
  "drizzle":"drizzle.jpg",
  "hail":"hail.jpg",
  "hurricane":"hurricane.jpg",
  "rain":"rain.jpg",
  "sleet":"sleet.jpg",
  "snow":"snow.jpg",
  "sunny":"sunny.jpg",
  "thunderstorm":"thunderstorm.jpg",
  "tornado":"tornado.jpg",
  "tropical-storm":"tropical-storm.jpg",
    "windy":"windy.jpg"
};
var GetDatas ={

};
$(document).ready(function(){
    locations = geoLocations();
    $("#selectedCountry").change(
        function(){
            var value = $("#selectedCountry").val();
            console.log(value);
            var url = "https://api.darksky.net/forecast/237353d7c54e99ba4ed960cbbc4a3c8f/"+locationsCoords[value][0]+","+locationsCoords[value][1]+"?extend=hourly&callback=?";

            $.getJSON(url,function(d){
                console.log(d);
                GetDatas[value] = d;
                var icon = GetDatas[value]["currently"]["icon"];
                icon="wi wi-forecast-io-" +icon;
                console.log(icon);
                $("#Country").text(CityList[value]);
                $("#apparentTemperature").text(GetDatas[value]["currently"]["apparentTemperature"]);
                $("#cloudCover").text(GetDatas[value]["currently"]["cloudCover"]);
                $("#Weather").html("<i class='"+icon+"'></i>");
                $("#summary").text(GetDatas[value]["currently"]["summary"]);
                //$("#test").html("<i class=\"" + icon + "\">");
            });
        }
    );

        //locationWeather()

});


function geoLocations(){
    var locations = {}
    $.ajax({
        format: "jsonp",
        dataType: "jsonp",
        url: "http://ip-api.com/json",
        timeout: 600,
        success: function(data) {
            console.log(data);
            locations.lat = data.lat;
            locations.lng = data.lon;
        },
        error: function() {
            locations.lat = 25.0418;
            locations.lng = 121.4966;

                locationWeather();

        },
        method: "GET"
    }).success(
        function(){
            locationWeather();
        }
    );
    return locations;
}


var darkSkyURL = "";
var weather = {};

function locationWeather(){
    //locations = geoLocations();


    darkSkyURL = "https://api.darksky.net/forecast/237353d7c54e99ba4ed960cbbc4a3c8f/"+locations.lat+","+locations.lng+"?extend=hourly&callback=?";

    var weather = $.getJSON(darkSkyURL,function (data) {
        var fontColor = d3.scale.linear().range(["#92ffb6","#000000"])
            .domain([0,43200]); //86400
        var color=d3.scale.linear()
            .range(["#000000", "#fffdbf"])
            .domain([0,43200]); //86400
        var currentDate = new Date();
        var nowSecond = currentDate.getHours()*3600+ currentDate.getMinutes()*60 + currentDate.getSeconds();
        var todayColors = 0;
        var iconColors = 0;
        if(currentDate.getHours()>=12){
            todayColors = color(86400-nowSecond);
            iconColors = fontColor(nowSecond);
        }
        else{
            todayColors = color(nowSecond);
            iconColors = fontColor(86400-nowSecond);
        }
        console.log(fontColor(nowSecond))
        skycons = new Skycons({"color": iconColors});
        var temp = data["currently"]["icon"];
        temp = temp.replace(/-/g,"_");

        skycons.add("icon1", Skycons[temp.toUpperCase()]);
        skycons.play();

        $("#currentlyWeather").css("background-color",todayColors);
        $("#currentlyWeather").css("color",iconColors);
        $("#apparentTemperature2").text(data["currently"]["apparentTemperature"]);
        $("#cloudCover2").text(data["currently"]["cloudCover"]);
        var icon = data["currently"]["icon"];
        icon="wi wi-forecast-io-" +icon;
        $("#Weather2").html("<i class='"+icon+"'></i>");
        $("#summary2").text(data["currently"]["summary"]);
        $("#place").css("background-color",todayColors);
        $("#place").css("color",iconColors);
        var canvas = document.getElementById("startPic");
        var ctx = canvas.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("最近天氣", canvas.width/2+20, canvas.height/2);
        var d = new Date();
        var weekday = new Array(7);
        weekday[0] =  "星期日";
        weekday[1] = "星期一";
        weekday[2] = "星期二";
        weekday[3] = "星期三";
        weekday[4] = "星期四";
        weekday[5] = "星期五";
        weekday[6] = "星期六";

        var n = weekday[d.getDay()];

        for(var i=0;i<8;i++){
            $("#innerCarousel").append("<div class='item nav-inverse'>" +
                "<canvas id='day"+i+"'></canvas>"
                +"<div class='carousel-caption text-danger'><p>"+weekday[(d.getDay()+i)%7]+"</p> </div></div>");
            skycons = new Skycons({"color": "yellow"});

            var temp = data["daily"]["data"][i]["icon"];
            temp = temp.replace(/-/g,"_");

            skycons.add("day"+i, Skycons[temp.toUpperCase()]);
            skycons.play();

        }
    });

}



