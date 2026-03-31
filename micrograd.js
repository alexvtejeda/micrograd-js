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
    for( let i = 0; i <= nin; i++){
      this.w.push(new Value(Math.random()* 2 - 1))
    }
    this.b = new Value(Math.random() * 2 - 1)
  }
  call(x){
    // weight * x + bias
    let out
    for (let i = 0; i <= this.w.length; i++){
      out = this.w[i].mul(x[i])
      out.add(b)
    }
    return out
  }
}

console.log(new Neuron(2));
