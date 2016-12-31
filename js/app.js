"use strict";

var width;
var height;
var ctx;
var artcanvas;
var painterWorker;//Web worker for canvas painting
var imageData;
var stylefn;

$(document).ready(function () {
    //Default
     NProgress.configure({ showSpinner: false });
     NProgress.configure({ trickle: false });
    if( isMobile.any())
    {
        $("#resolution").val('320x240');
         artcanvas.width = 320;
         artcanvas.height = 240;
         width = artcanvas.width;
         height =artcanvas.height;

    }
    else{
        $("#resolution").val('640x480');
         artcanvas.width = 640;
         artcanvas.height = 480;
          width = artcanvas.width;
         height =artcanvas.height;
    }
    $('#resolution').on('change', function () {

        var res = this.value.split("x");
        console.log(res);
        artcanvas.width = (res[0]);
        artcanvas.height = (res[1]);
         width = artcanvas.width;
         height =artcanvas.height;
        // alert(res[0] );
        console.log(artcanvas.width+":"+artcanvas.height)
    });
    stylefn = "logfnex";
    $("#strength").val('2');
    //Select style
    $("#styleselect").imagepicker({

        selected: function (option) {

            //disabling style strength
            $('#strength').prop('disabled', true);

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
                    $("#strength").val('8');
                    $('#strength').prop('disabled', false);
                    break;
                case "logfnex":
                    $('#nneurons').val(12);
                    $('#nhlayer').val(1);
                    $("#strength").val('2');
                    $('#strength').prop('disabled', false);
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
                    $("#strength").val('8');
                    $('#strength').prop('disabled', false);
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

addEventListener('DOMContentLoaded', function () {

    $("#paintanim").hide();
    $('#startBtn').prop('disabled', false);
    $('#stopBtn').prop('disabled', true);
    artcanvas = document.getElementById("nartCanvas");
    ctx = artcanvas.getContext("2d");
    width = artcanvas.width;
    height =artcanvas.height;

}, false);

function startPainting() {
   
    if (!window.Worker) { // Check if Browser supports the Worker api.
        alert("Web workers not supported,please upgrade your browser.");
        //Nothing to do :(
        return;
    }
 
    $("#paintanim").show("slide", { direction: "left" }, 250);
    $("#duration").html("");

    if (painterWorker) {
        painterWorker.terminate();
    }

    $('#startBtn').prop('disabled', true);
    $('#stopBtn').prop('disabled', false);
    $('#resolution').prop('disabled', true);
    console.log(stylefn);

    var networksize = $('#nneurons').val();
    var nhidden = $('#nhlayer').val();
    var sstren = $('#strength').val();

    //Our web worker 
    painterWorker = new Worker('js/neuralpaint.js');
    imageData = ctx.createImageData(width, height);

    painterWorker.postMessage({
        op: "start",
        imgdata: imageData,
        nlfun: stylefn,
        w: width,
        h: height,
        netsz: networksize,
        hidsz: nhidden,
        strokestrength: sstren
    });

    NProgress.start() ;
    painterWorker.onerror = function (event) {
        console.log(event.message, event);
        alert(event.message);
    };

    painterWorker.onmessage = function (event) {
        
        //Got data ffrom RNN...paint it 
        switch (event.data.status) {
            case "finished":
      
                $("#duration").html("Took " + parseInt(event.data.etime) + " seconds");
                $('#startBtn').prop('disabled', false);
                $('#stopBtn').prop('disabled', true);
                $('#resolution').prop('disabled', false);
                NProgress.done();
                break;
            case "image":
                   ctx.putImageData(event.data.imagedata, 0, 0);
                   NProgress.set(event.data.progress/100) ;
                   $("#duration").html(event.data.progress+"%")
                break;
        }
    };

}

function stopPainting() {

    $("#duration").html("")
    $('#startBtn').prop('disabled', false);
    $('#resolution').prop('disabled', false);
    $('#stopBtn').prop('disabled', true);
    painterWorker.terminate();
    NProgress.done();

}

function downloadCanvas(link, canvasId, filename) {

    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.download = filename;

}


document.getElementById('download').addEventListener('click', function () {
 
    downloadCanvas(this, 'nartCanvas', 'neural-painting_'+stylefn+'.png');
}, false);

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};