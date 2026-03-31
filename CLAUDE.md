# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JavaScript implementation of Karpathy's micrograd — a tiny autograd engine with Graphviz visualization. Educational project for understanding backpropagation and neural networks from first principles.

## File Structure

- `micrograd.js` — Value class (autograd engine) and neural net classes (Neuron). Pure logic, no browser dependencies.
- `graphviz.js` — Graph visualization using viz-js. Imports Value from micrograd.js. Browser only.
- `index.html` — Loads graphviz.js for rendering computation graphs.

## Running

- `npm run dev` — live-reloading server at localhost:39981 for graph visualization
- `node micrograd.js` — run/debug the autograd engine and neural net logic without a browser

## Architecture

**Value class**: Core autograd primitive. Each Value holds `data`, `grad`, and a `_backward` closure. Operations (`add`, `mul`, `tanh`, `exp`, `pow`, `sub`, `neg`, `truediv`) return new Values wired into a computation graph. `backward()` does a topological sort then calls `_backward` in reverse order.

**Neuron class**: Takes `nin` (number of inputs), initializes random weights and bias as Values. `call(x)` computes weighted sum + bias.

**Visualization**: `trace()` walks the graph collecting nodes/edges, `buildDot()` generates DOT language, viz-js renders it as SVG.

## Key Details

- Value operations auto-wrap plain numbers via `instanceof Value` check (currently only in `mul`)
- Node IDs in graphs use a sequential counter, not random — avoids Graphviz rendering glitches
- `package.json` has `"type": "module"` — use ES module syntax (`import`/`export`)
- This is a subdirectory of a larger repo but is pushed separately via `git subtree push --prefix=micrograd origin-micrograd main`
