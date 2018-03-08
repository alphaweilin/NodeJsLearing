function $(s){
    return document.querySelectorAll(s);
}

var array = $("#list li");
var size = 128; //number of column

var box = $("#box")[0];
var height, width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
box.appendChild(canvas);
var dots = [];
var line;

var mv = new MusicVisualizer({
    size: size,
    visualizer: draw
});
for(var i = 0; i < array.length; i++){
    array[i].onclick = function(){
        for(var j = 0; j < array.length; j++){
            array[j].className = "";
        }
        this.className = "selected";
        // load("/media/"+this.title);
        mv.play("/media/"+this.title);
    }
}

function random(m,n){
    return Math.round(Math.random()*(n - m) + m);
}
function getDots(){
    dots = [];
    for(var i = 0; i < size; i++){
        var x = random(0,width);
        var y = random(0,height);
        var color = "rgba(" + random(0,255) + "," + random(0,255) + ","+ random(0,255) + ",0)";
        dots.push({
            x : x,
            y : y,
            dx : random(1,4),
            color : color,
            cap : 0
        });
    }
}

function resize(){
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height = height;
    canvas.width = width;
    line = ctx.createLinearGradient(0,0,0,height);
    line.addColorStop("0","red");
    line.addColorStop("0.5","yellow");
    line.addColorStop("1","green");
    getDots();
}
resize();

window.onresize = resize;

function draw(arr){
    ctx.clearRect(0, 0, width, height);
    var w = width / size;
    var cw = w * 0.6;
    var capH = cw > 10 ? 10 : cw;
    ctx.fillStyle = line;
    for(var i = 0; i < size; i++){
        var o = dots[i];
        if(draw.type == "column"){
            var h = arr[i] / 256 * height;
            ctx.fillRect(w * i, height - h, cw, h);
            ctx.fillRect(w * i, height - (o.cap+capH), cw, capH);
            o.cap--;
            if(o.cap < 0){
                o.cap = 0;
            }
            if(h > 0 && o.cap < h + 40){
                o.cap = h + 40 > height - capH ? height - capH : h + 40;
            }

        }else if(draw.type == "dot"){
            ctx.beginPath();
            var r = 10 + arr[i] /256 * (height > width ? width : height) / 10;
            ctx.arc(o.x, o.y, r, 0, Math.PI*2, true);
            var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0, "#fff");
            g.addColorStop(1, o.color);
            ctx.fillStyle = g;
            ctx.fill();
            o.x += o.dx;
            o.x = o.x > width ? 0 : o.x;
            // ctx.strokeStyle = "#fff";
            // ctx.stroke();
        }
    }
}

draw.type = "column";
var types = $("#type li");
for(var i = 0; i < types.length; i++){
    types[i].onclick = function(){
        for(var j = 0; j < types.length; j++){
            types[j].className = "";
        }
        this.className = "selected";
        draw.type = this.getAttribute("data-type");
    }
}

$("#volume")[0].onchange = function(){
    mv.changeVolume(this.value/this.max);
}
//call onchange method
$("#volume")[0].onchange();