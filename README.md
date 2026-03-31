# Micrograd in JS
This repo is dedicated to translate the [python code](https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/micrograd/micrograd_lecture_first_half_roughly.ipynb) Andrej Karpathy wrote for us to understand what libraries like Pytorch do behind the scenes. The essence is to understand the nuances of Neural Networks and how they make decisions based on the operations we give them. So far, I added multiplication, addition, tanh, exp, pow, sub, neg and truediv. Currently working on building a small neural net (Neuron class).

## Core concepts learned

Backpropagation, Loss functions and a lot of basic calculus.

To be able to visualize our progress I decided to use graphviz, the same graph Mr. Karpathy used, but in JS [viz-js](https://github.com/mdaines/viz-js). 

## Project structure

- `micrograd.js` — Value class (autograd engine) and Neuron class. Pure logic, no browser dependencies. Run with `node micrograd.js` to debug.
- `graphviz.js` — Graph visualization using viz-js. Only runs in the browser.
- `index.html` — Loads the visualization.

## Steps to reproduce

### Install dependencies
```
npm install
```

### Run the graph visualization (with live reload)
```
npm run dev
```
Opens at `localhost:39981`. Auto-refreshes when you save a file.

### Debug without browser
```
node micrograd.js
```