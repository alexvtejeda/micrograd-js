export class Value {
  constructor(data, label = "", op = "", prev = []) {
    this.data = data;
    this.grad = 0;
    this.label = label;
    this._op = op;
    this._prev = prev;
    this._backward = () => {};
  }

  /*--------- Operations in forward pass with their backpropagation logic ----------*/
  add(other){
    let out = new Value(this.data + other.data, '', '+', [this, other])
    out._backward = () => {
      this.grad += 1 * out.grad;
      other.grad += 1 * out.grad;
    }
    return out
  }
  mul(other){
    if(!(other instanceof Value)) other = new Value(other);
    let out = new Value(this.data * other.data, '', '*', [this, other])
    out._backward = () => {
      this.grad += other.data * out.grad;
      other.grad +=  this.data * out.grad;
    }
    return out
  }

  pow(other){
    let out = new Value(this.data ** other.data, '', '**', [this]);
    out._backward = () => {
      this.grad += other * (this.data ** (other - 1)) * out.grad
    }
    return out
  }


  truediv(other){
    return this.mul(other.pow(new Value(-1, "truediv")))
  }

  neg(){
    return this.mul(new Value(-1, "neg"))
  }

  sub(other){
    return this.add(other.neg());
  }

  exp(){
    let out = new Value(Math.exp(this.data), "", "exp", [this]);
    out._backward = () => {
      this.grad = out.grad * out.grad;
    }
    return out;
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
    for(let i = topo.length - 1; i >= 0; i--){
      topo[i]._backward()
    }
  }
}

// Neurons

class Neuron {
  constructor(nin){
    this.w = []
    for( let i = 0; i < nin; i++){
      this.w.push(new Value(Math.random()* 2 - 1))
    }
    this.b = new Value(Math.random() * 2 - 1)
  }
  call(x = []){
    // sum(weight * x) + bias
    x = x.map(v => v instanceof Value ? v : new Value(v))
    const wx = this.w.map((w, i) => w.mul(x[i]));
    const out = wx.reduce((acc, curr) => acc.add(curr), this.b);
    return out.tanh()
  }
}

class Layers {
  constructor(nin, nout){
    this.neurons = [];
    for(let i = 0; i < nout; i++){
      this.neurons.push(new Neuron(nin));
    }
  }

  call(x = []){
    x = x.map(v => v instanceof Value ? v : new Value(v))
    const outs = this.neurons.map((neurons) => neurons.call(x));
    return outs
  }

}
console.log("With layers: ", new Layers(2, 3).call([2, 3]), "\n=====================\n");
console.log("Manually: ", new Neuron(2).call([2, 3]));
