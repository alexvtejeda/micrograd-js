import { instance } from "/node_modules/@viz-js/viz/src/index.js";
import { Value } from "/micrograd.js";

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


const h = 0.001;
/*------------ tanh manually ---------------*/
function lol(){
  const a = new Value(2, "a"); a.label = "a";
  const b = new Value(-3 + h, "b"); b.label = "b";
  const c = a.add(b); c.label = "c";
  c.data += h;
  const d = new Value(4, "d").mul(c);
  const e2d = new Value(2).mul(d).exp(); e2d.label = "e"; // e^2d
  const over = e2d.sub(new Value(1, "-1")); over.label = "over"; // e^2d - 1
  const under = e2d.add(new Value(1, "1")); under.label = "under"; // e^2d + 1
  const o = over.truediv(under); o.label = "output"; // tanh = e^2d - 1 / e^2d + 1
  o.backward();
  return o;
}


const a = new Value(2, "a");
const b = new Value(-3 + h, "b");
const c = a.add(b); c.label = "c";
c.data += h;
const d = new Value(4, "d").mul(c);
const e = d.tanh(); e.label = "e";
e.backward();

let dot = buildDot(lol());
let tanh = buildDot(e);

instance().then(viz => {
  const svg = viz.renderSVGElement(dot);
  const svg2 = viz.renderSVGElement(tanh);
  document.getElementById("graph").appendChild(svg);
  document.getElementById("tanh").appendChild(svg2);
});
