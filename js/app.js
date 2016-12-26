"use strict";
var width;
var height;
var ctx;
var element;
var painterWorker;
var imageData;

addEventListener( 'DOMContentLoaded', function(){ 
	$("#paintanim").hide( );
$('#startBtn').prop('disabled', false);
$('#stopBtn').prop('disabled', true);	
element = document.getElementById("nartCanvas");
ctx = element.getContext("2d");
width = element.width;
height = element.height;	

}, false );

function startPainting()
{ //$("#duration").html("Painting...")
	$("#paintanim").show( "slide", { direction: "left" },250 );
 $("#duration").html("")	
	if (painterWorker)
	{
		painterWorker.terminate();
	}
  $('#startBtn').prop('disabled', true);
  $('#stopBtn').prop('disabled', false);
    var networksize = $('#nneurons').val();
	var nhidden = $('#nhlayer').val();
	painterWorker = new Worker( 'js/neuralpaint.js' );
	imageData = ctx.createImageData(width, height);
	painterWorker.postMessage({
    op: "start",
	imgdata:imageData,
	w:width,
	h:height,
	netsz:networksize,
	hidsz:nhidden
});

painterWorker.onmessage = function( event ){
//Got data paint it  


 switch(event.data.status){
        case "finished":
		      $("#paintanim").hide( "slide", { direction: "right" },250 );
			  $("#duration").html("Took "+parseInt(event.data.etime)+" seconds");
			  $('#startBtn').prop('disabled', false);
              $('#stopBtn').prop('disabled', true);	
			  
              break;
        case "image":
		      ctx.putImageData(event.data.imagedata, 0, 0);
			  break;
    } 
};
}
function stopPainting()
{
$("#paintanim").hide( "slide", { direction: "right" },250 );
 $("#duration").html("")	
$('#startBtn').prop('disabled', false);
$('#stopBtn').prop('disabled', true);	
painterWorker.terminate();
}

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.download = filename;
}

  
document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'nartCanvas', 'neural-painting.png');
},  false);
