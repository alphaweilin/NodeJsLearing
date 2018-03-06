function $(s){
    return document.querySelectorAll(s);
}

var array = $("#list li");

for(var i = 0; i < array.length; i++){
    array[i].onclick = function(){
        for(var j = 0; j < array.length; j++){
            array[j].className = "";
        }
        this.className = "selected";
        load("/media/"+this.title);
    }
}

var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode = ac.createGain();
gainNode.connect(ac.destination);

var source = null;

var count = 0;

function load(url){
    var n = ++count;
    source && source.stop();
    xhr.abort();
    xhr.open("GET",url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(){
        //console.log(xhr.response); 
        if(n != count) return;
        ac.decodeAudioData(xhr.response, function(buffer){
            if(n != count) return;
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(gainNode);
            bufferSource[bufferSource.start?"start":"noteOn"](0);
            source = bufferSource;
        },function(err){
            console.log(err);
        });
    }
    xhr.send();
}

function changeVolume(percent){
    gainNode.gain.value = percent * percent;
}

$("#volume")[0].onchange = function(){
    changeVolume(this.value/this.max);
}
//call onchange method
$("#volume")[0].onchange();