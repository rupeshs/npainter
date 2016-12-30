"use strict";
var width;
var height;
var ctx;
var element;
var painterWorker;
var imageData;
var stylefn;
$(document).ready(function(){
	
	
	
	stylefn="tanh";
   $("#styleselect").imagepicker({
  
    selected: function(option){
	 $('#sstrenth').prop('disabled', true);
        stylefn = this.val();
       switch (stylefn) {
  case "tanh":
  $('#nneurons').val(16);
  $('#nhlayer').val(8);
  break;
  case "tanhabs":
  $('#nneurons').val(20);
  $('#nhlayer').val(8);
  
  break;
  case "logfn":
  $('#nneurons').val(4);
  $('#nhlayer').val(2);
  $("#sstrenth").val('8');
  $('#sstrenth').prop('disabled', false);
  break;
   case "logfnex":
  $('#nneurons').val(12);
  $('#nhlayer').val(1);
  $("#sstrenth").val('2');
   $('#sstrenth').prop('disabled', false);
  break;
   case "squar":
  $('#nneurons').val(16);
  $('#nhlayer').val(8);
   break;
  case "inv":
  $('#nneurons').val(24);
  $('#nhlayer').val(2);

  break;
  case "xlogxsq":
  $('#nneurons').val(6);
  $('#nhlayer').val(8);
  $("#sstrenth").val('8');
   $('#sstrenth').prop('disabled', false);
  break;
  case "invxlogx":
  $('#nneurons').val(9);
  $('#nhlayer').val(2);
  
  break;
    case "logx1":
  $('#nneurons').val(12);
  $('#nhlayer').val(1);
 
  break;
   case "logxp1":
  $('#nneurons').val(8);
  $('#nhlayer').val(2);
 
  break;
   case "tanhlog":
  $('#nneurons').val(9);
  $('#nhlayer').val(4);
  break;
  case "invlogxp1":
  $('#nneurons').val(8);
  $('#nhlayer').val(1);
  break;
  }
  
    }
});
 
});

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
{
if (!window.Worker) { // Check if Browser supports the Worker api.
	alert("Web workers not supported,please upgrade your browser.");
	return;
}
$("#paintanim").show( "slide", { direction: "left" },250 );
 $("#duration").html("")	
	if (painterWorker)
	{
		painterWorker.terminate();
	}
	var sstren=$('#sstrenth').val();
	console.log(stylefn);
  $('#startBtn').prop('disabled', true);
  $('#stopBtn').prop('disabled', false);
    var networksize = $('#nneurons').val();
	var nhidden = $('#nhlayer').val();
	painterWorker = new Worker( 'js/neuralpaint.js' );
	imageData = ctx.createImageData(width, height);
	painterWorker.postMessage({
    op: "start",
	imgdata:imageData,
	nlfun:stylefn,
	w:width,
	h:height,
	netsz:networksize,
	hidsz:nhidden,
	strokestrenth:sstren
});
painterWorker.onerror = function (event) {
            console.log(event.message, event);
			alert(event.message);
};
         
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
