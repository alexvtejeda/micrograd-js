# Micrograd in JS
This repo is dedicated to translate the [python code](https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/micrograd/micrograd_lecture_first_half_roughly.ipynb) Andrej Karpathy wrote for us to understand what libraries like Pytorch do behind the scenes. The essence is to understand the nuances of Neural Networks and how they make decisions based on the operations we give them. So far, I just added multiplication, addition and tanh, but I haven't written or built any neural nets.

## Core concepts learned

Backpropagation, Loss functions and a lot of basic calculus.

To be able to visualize our progress I decided to use graphviz, the same graph Mr. Karpathy used, but in JS [viz-js](https://github.com/mdaines/viz-js). 

## Steps to reproduce

### Install dependencies
```
npm install
```

### Run the server
```
npx serve
```

This way, you'll be able to see the graph in your browser. Each time you make a change you'll have to manually refresh.