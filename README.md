# Npainter 

Artistic patterns using recurrent neural network.
We use recurrent neural network that takes coordinate (x, y) and outputs RBG value to generate the patterns.
We have added non linearity functions to [recurrent.js](https://github.com/karpathy/recurrentjs)  and  by randomly assigning weights to neural network.
You can try [Npainter](https://rupeshs.github.io/npainter/)

<img class="screenshots" src="img/logxex.png" >

# Gallery
High res available [here]( https://rupeshs.github.io/npainter/gallery.html)
<img class="screenshots" src="img/paintings.jpg" >

## Different non linearity functions used to generate patterns.

Parameters of styling network

1.Number of neurons per layer

2.Number of hidden layers

3 Stroke strength

| Style         |Non linearity function | stroke strength
| ------------- |-------------|-------------:|
|<img src="img/logfnex.png" >     | out.w[i] = Math.log10(Math.abs(m.w[i]) + sstrength) | 1e-1 to 1e-10|
|<img src="img/tanh.png" >        | out.w[i] = Math.tanh(Math.abs(m.w[i])) | |
|<img src="img/logxp1.png" >      | out.w[i] = Math.log(Math.abs(m.w[i]) + 0.1) |  |
|<img src="img/tanhabs.png" >     | out.w[i] = out.w[i] = Math.tanh(Math.abs(m.w[i])) |  |
|<img src="img/squar.png" >       | out.w[i] = Math.abs(m.w[i] * m.w[i])|  |
|<img src="img/inv.png" >         | out.w[i] = m.w[i] * Math.abs(1 / m.w[i])|  |
|<img src="img/xlogxsq.png" >     | out.w[i] = m.w[i] * Math.log10(Math.abs(m.w[i] * m.w[i]) + sstrength);| 1e-1 to 1e-10 |
|<img src="img/invxlogx.png" >    | out.w[i] = Math.abs(1 / m.w[i]) * m.w[i] * Math.log(Math.abs(m.w[i]) + 9e-1)|  |
|<img src="img/logx1.png" >       | out.w[i] = Math.log(Math.abs(m.w[i]) + 1)|  |
|<img src="img/tanhlog.png" >     | out.w[i] = Math.abs(1 / Math.tanh(m.w[i])) * m.w[i] * Math.log10(Math.abs(m.w[i]) + 8.5e-1)|  |
|<img src="img/invlogxp1.png" >   | out.w[i] = Math.abs(1 / m.w[i]) * m.w[i] * Math.log10(Math.abs(m.w[i]) + 1e-1)|  |

### References
[Neural Network Generative Art](http://blog.otoro.net/2015/06/19/neural-network-generative-art/)
[The Unreasonable Effectiveness of Recurrent Neural Networks] (http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
[Web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)


