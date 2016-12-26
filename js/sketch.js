(function () {

"use strict";

// settings of nnet:
var networkSize =16;
var nHidden = 8;
var nOut = 3; // r, g, b layers
var G ;
var modl;
var width,height;
var imageData;


var initModel = function() {
  importScripts("recurrent.js");
  G= new R.Graph(false);
  var model = [];
  var i;

  var randomSize = 1.0;
  // define the model below:
  model.w_in = R.RandMat(networkSize, 3, 0, randomSize); // x, y, and bias

  for (i = 0; i < nHidden; i++) {
    model['w_'+i] = R.RandMat(networkSize, networkSize, 0, randomSize);
  }

  model.w_out = R.RandMat(nOut, networkSize, 0, randomSize); // output layer
  console.log(model);
  return model;
};

var forwardNetwork = function(G, model, x_, y_) {
  // x_, y_ is a normal javascript float, will be converted to a mat object below
  // G is a graph to amend ops to
  var x = new R.Mat(3, 1); // input
  var i;
  x.set(0, 0, x_);
  x.set(1, 0, y_);
  x.set(2, 0, 1.0); // bias.
  var out;

  out = G.tanh(G.mul(model.w_in, x));

  for (i = 0; i < nHidden; i++) {
    out = G.tanh(G.mul(model['w_'+i], out));
  }

  out = G.sigmoid(G.mul(model.w_out, out));
  return out;
};
function getColorAt(model, x, y) {
  // function that returns a color given coordintes (x, y)
  // (x, y) are scaled to -0.5 -> 0.5 for image recognition later
  // but it can be behond the +/- 0.5 for generation above and beyond
  // recognition limits
  var r, g, b;
  var out = forwardNetwork(G, model, x, y);

  r = out.w[0]*255.0;
  g = out.w[1]*255.0;
  b = out.w[2]*255.0;
  if (r>255||g>255||b>255)
  {
    console.log("out of range");
  }

  return [r,g,b];
}

function setPixel(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}
function neuralPaint(height,width)
{
modl =initModel();
for (var y = 0; y < height; y++) {
	for (var x = 0; x < width; x++) {
      //scale x and y in range  -0.5 to 0.5 
	     var rgb=getColorAt(modl, x/width-0.5,y/height-0.5);
		//console.log(rgb);
		setPixel(imageData,x,y,rgb[0],rgb[1],rgb[2],255);
	
	}
	postMessage(imageData);
}
}

onmessage = function( event ){
     
	switch(event.data.op){
        case "start":
            console.log("width" ,event.data.w);
			console.log("height",event.data.h);
			imageData=event.data.imgdata;
			neuralPaint(event.data.h,event.data.w);
            break;
        case "stop":
            break;
    }
    
  }
}());