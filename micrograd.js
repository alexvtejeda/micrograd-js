import Viz from "/node_modules/@viz-js/viz/lib/viz-standalone.mjs";

class Value {
  constructor(data, label = "", op = "", prev = []) {
    this.data = data;
    this.grad = 0;
    this.label = label;
    this._op = op;
    this._prev = prev;
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

  for (const n of nodes) {
    const uid = (n._id ??= Math.random().toString(36).slice(2));
    dot += `${uid} [label="{ ${n.label} | data ${n.data} | grad ${n.grad} }", shape=record];\n`;

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

const a = new Value(2, "a");
const b = new Value(3, "b");
const c = new Value(5, "c", "+", [a, b]);

const dot = buildDot(c);

Viz.instance().then(viz => {
  const svg = viz.renderSVGElement(dot);
  document.getElementById("graph").appendChild(svg);
});