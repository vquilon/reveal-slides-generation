<!-- .slide: style="text-align: center;" class="b5 cover" -->
# Bloque 9
<img src="/assets/img/PyTorch_logo_black.png" width="80%"></img>
<div>
    <h3 class="subtitle">y Desarrollo de Algoritmos de Machine Learning</h3>
    <h4>Introducción a PyTorch</h4>
</div>

* * *

<!-- .slide: class="b5 subcover" -->
## 01
## Comparación Notebook VS Proyecto

* * *

<!-- .slide: class="b5 normal" -->
### ¿Qué es PyTorch?
- Librería open source desarrollada por un equipo de “Facebook's AI Research lab” en 2016.
- Framework para trabajar con tensores usando GPUs y CPUs
- Usado en Artificial Vison y Natural Language Processing (NLP)
- Estandarizado en OpenAI [link](https://openai.com/blog/openai-pytorch)

* * *

<!-- .slide: class="b5 normal images" -->
### ¿Por qué  PyTorch?

![Microsoft-CogTK](/assets/img/Microsoft-CogTK.png)
![keras](/assets/img/keras.png)
![tensorflow](/assets/img/tensorflow.png)
![logochainer](/assets/img/logochainer.png)
![gluon](/assets/img/gluon.png)
![og_image_caffe2](/assets/img/og_image_caffe2.png)

* * *

<!-- .slide: class="b5 normal cite-ref" -->
### ¿Por qué  PyTorch?
<div class="content">
    <img style="object-fit: cover; height: 300px; width: 60%; object-position: 98% 0%; margin:0;" src="/assets/img/usage_frameworks_like_pytorch.jpg"></img>
    <article>
        <heading>Andrej Karpathy</heading>
        <small>Director of artificial intelligence and Autopilot Vision at Tesla. Works for OpenAI, where he specializes in deep learning and computer vision.</small>
        <cite><a href="https://twitter.com/karpathy/status/972295865187512320" target="_blank"> X (Tweet)</a></cite>
    </article>
<div>

> Note:
Unique mentions of deep learning frameworks in arxiv papers (full text) over time, based on 43K ML papers over last 6 years. So far TF mentioned in 14.3% of all papers, PyTorch 4.7%, Keras 4.0%, Caffe 3.8%, Theano 2.3%, Torch 1.5%, mxnet/chainer/cntk <1%.
(cc @fchollet)


* * *
<!-- .slide: class="b5 normal single-img" -->

### ¿Por qué  PyTorch?

Grafico computacional interno
<pre>
<code class="language-plantuml">
@startuml
    digraph G {
        rankdir=LR;
        A [shape=box label="*" style=filled fillcolor="#ffb4b9"]
        B [shape=box label="+" style=filled fillcolor="#ffb4b9"]
        S [shape=box label="Σ" style=filled fillcolor="#ffb4b9"]
        x [shape=circle style=filled fillcolor="#cda2f1"]
        y [shape=circle style=filled fillcolor="#cda2f1"]
        z [shape=circle style=filled fillcolor="#cda2f1"]
        a [shape=circle style=filled fillcolor="#cda2f1"]
        b [shape=circle style=filled fillcolor="#cda2f1"]
        c [shape=circle style=filled fillcolor="#cda2f1"]
        x -> A
        y -> A
        A -> a
        a -> B
        B -> b
        b -> S
        S -> c
        z -> B
    }
@enduml
</code>
</pre>

* * *

<!-- .slide: class="normal two-columns" -->

<div class="column col1">Lorem ipsum</div>
<div class="column col2">Lorem ipsum</div>

* * *

<!-- .slide: class="normal title-two-columns" -->

### Titulo

<div class="content">
    <div class="column col1">Lorem ipsum</div>
    <div class="column col2">Lorem ipsum</div>
</div>

* * *

<!-- .slide: class="normal editor" -->

### Ejercicio: Operaciones básicas con tensores y componentes principales

<iframe data-mode="python" data-theme="ace/theme/one_dark" data-fontsize="20px" width=100% height=200px class="ace">
import numpy as np
np.random.seed(0)
import tensorflow as tf

N, D = 3, 4

with tf.device('gpu:0'):
    x = tf.placeholder(tf.float32)
    y = tf.placeholder(tf.float32)
    z = tf.placeholder(tf.float32)
    a = x * y
    b = a + z
    c = tf.reduce_sum(b)

grad_x, grad_y, grad_z = tf.gradients(c, [x, y, z])

with tf.Session() as sess:
    values = {
        x: np.random.randn(N, D)
        y: np.random.randn(N, D)
        z: np.random.randn(N, D)
    }
    out = sess.run([c, grad_x, grad_y, grad_z], feed_dict=values)
    c_val, grad_x_val, grad_y_val, grad_z_val = out
</iframe>

* * *

<!-- .slide: class="normal quote" -->

> Its not ChatGPT vs Bard \
> Its        GPUs vs TPUs \
> ...and who can multiply matrices at a lower cost.
> > [X (Tweet)](https://twitter.com/cgarciae88/status/1622791460624949248) <!-- .element: target="_blank" -->
> ##### Cristian Garcia
<!-- .element: class="cite" -->

* * *

<!-- .slide: class="normal quote consolas" -->

> Its not ChatGPT vs Bard \
> Its        GPUs vs TPUs \
> ...and who can multiply matrices at a lower cost.
> > [X (Tweet)](https://twitter.com/cgarciae88/status/1622791460624949248) <!-- .element: target="_blank" -->
> ##### Cristian Garcia
<!-- .element: class="cite" -->

* * *

<!-- .slide: class="normal quote consolas dark-theme" -->

> "If I had 8 hours to build a machine learning model,
> I'd spend the first 6 hours preparing my dataset."
> \- Abraham Lossfunction
> > [X (Tweet)](https://twitter.com/mrdbourke/status/1456087631641473033) <!-- .element: target="_blank" -->
> ##### Daniel Bourke
<!-- .element: class="cite" -->

* * *

<!-- .slide: class="normal" -->

### Codigo con animaciones
```python [|4,8-11|17|22-24]
image=[]
labels=[]
for file in os.listdir(BASE_PATH):
    if file=='Coleoptera':
        for c in os.listdir(os.path.join(BASE_PATH, file)):
            if c!='annotations':
                image.append(c)
                labels.append('Coleoptera')
    if file=='Diptera':
        for c in os.listdir(os.path.join(BASE_PATH, file)):
            if c!='annotations':
                image.append(c)
                labels.append('Diptera')
    if file=='Hymenoptera':
        for c in os.listdir(os.path.join(BASE_PATH, file)):
            if c!='annotations':
                image.append(c)
                labels.append('Hymenoptera')
    if file=='Lepidoptera':
        for c in os.listdir(os.path.join(BASE_PATH, file)):
            if c!='annotations':
                image.append(c)
                labels.append('Lepidoptera')
data = {'Images':image, 'labels':labels} 
data = pd.DataFrame(data) 
data.head()
```

* * *

<!-- .slide: class="normal" -->

### Tablas

| Item     | Value  | Quantity |
|:--------:|:------:|:--------:|
| Apples   | $1     | 7        |
| Lemonade | $2     | 18       |
| Bread	   | $3     | 2        |