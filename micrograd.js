import { instance } from "/node_modules/@viz-js/viz/src/index.js";

class Value {
  constructor(data, label = "", op = "", prev = []) {
    this.data = data;
    this.grad = 0;
    this.label = label;
    this._op = op;
    this._prev = prev; 
    this._backward = () => {};
  }
  add(other){
    let out = new Value(this.data + other.data, '', '+', [this, other])
    out._backward = () => {
      this.grad += 1 * out.grad;
      other.grad += 1 * out.grad;
    }
    return out
  }
  mul(other){
    let out = new Value(this.data * other.data, '', '*', [this, other])
    out._backward = () => {
      this.grad += other.data * out.grad;
      other.grad +=  this.data * out.grad;
    }
    return out
  }

  tanh(){
    let x = this.data;
    let t = (Math.exp(2*x) - 1) / (Math.exp(2*x) + 1)
    let out = new Value(t, '', 'tanh', [this]);
    out._backward = () => {
      this.grad += (1 - t**2) * out.grad
    }
    return out
  }

  backward(){
    let topo = [];
    let visited = new Set();
    let buildTopo = (v) => {
      if(!visited.has(v)){
        visited.add(v);
        for(const child of v._prev){
          buildTopo(child);
        }
        topo.push(v);
      }
    }
    buildTopo(this)
    this.grad = 1
    // Reversed loop
    for(let i = topo.length-1; i >= 0; i--){
      topo[i]._backward()
    }
  }
}


function trace(root) {
  const nodes = new Set();
  const edges = new Set();

  function build(v) {
    if (!nodes.has(v)) {
      nodes.add(v);
      for (const child of v._prev) {
        edges.add([child, v]);
        build(child);
      }
    }
  }

  build(root);
  return { nodes, edges };
}

function buildDot(root) {
  const { nodes, edges } = trace(root);

  let dot = "digraph G {\nrankdir=LR;\n";
  let nextId = 0;
  for (const n of nodes) {
    const uid = (n._id ??= "n" + (nextId++));
    dot += `${uid} [label="{ ${n.label} | data ${n.data.toFixed(4)} | grad ${n.grad.toFixed(4)} }", shape=record];\n`;

    if (n._op) {
      const opId = uid + "_op";
      dot += `${opId} [label="${n._op}"];\n`;
      dot += `${opId} -> ${uid};\n`;
    }
  }

  for (const [n1, n2] of edges) {
    dot += `${n1._id} -> ${n2._id}_op;\n`;
  }

  dot += "}";
  return dot;
}
const h = 0.001
const a = new Value(2, "a");
const b = new Value(-3 + h, "b");
const c = a.add(b); c.label = "c";
c.data += h
const d = new Value(4, "d");
const e = d.mul(c); e.label = "e";
const f = e.tanh(); f.label = "f";
f.backward();
let dot = buildDot(f);


instance().then(viz => {
  const svg = viz.renderSVGElement(dot);
  document.getElementById("graph").appendChild(svg);
});