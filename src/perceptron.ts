const {plot} = require("nodeplotlib")
export default class Perceptron {
  private threshold: number;
  private bias: number;
  private weights: number[];
  private learningRate: number;
  private trainingSet: { inputs: number[]; output: string }[];
  constructor(
    learningRate: number,
    threshold: number,
    bias: number,
    trainingSet: { inputs: number[]; output: string }[]
  ) {
    this.learningRate = learningRate;
    this.threshold = threshold;
    this.bias = bias;
    this.trainingSet = trainingSet;
    this.weights = new Array(trainingSet[0].inputs.length).fill(0);
  }
  train() {
    let errorCount = 1;
    let iteration = 0;

    while (errorCount > 0) {
      errorCount = 0;

      for (const sample of this.trainingSet) {
        const weightedSum = this.dotProduct(sample.inputs) + this.bias;
        const output = this.activate(weightedSum);
        const target = this.getTargetValue(sample.output);

        if (output !== target) {
          const error = target - output;
          this.updateWeights(sample.inputs, error);
          this.bias += this.learningRate * error;
          errorCount++;
        }
      }

      iteration++;
    }

    console.log(`Training completed in ${iteration} iterations.`);
  }
  activate(weightedSum: number) {
    return weightedSum >= this.threshold ? 1 : 0;
  }

  getTargetValue(output: string) {
    return output === "1" ? 1 : 0;
  }
  updateWeights(inputs:number[], error:number) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.learningRate * error * inputs[i];
    }
  }
  private dotProduct(inputs: number[]) {
    return inputs.reduce(
      (sum, valor, index) => sum + valor * this.weights[index],
      0
    );
  }
  evaluate(testingSet:{ inputs: number[]; output: string }[]){
    for (const sample of testingSet) {
        const weightedSum = this.dotProduct(sample.inputs) + this.bias;
        const output = this.activate(weightedSum);
        const target = this.getTargetValue(sample.output);
      
        console.log('Input:', sample.inputs);
        console.log('Predicted Output:', output);
        console.log('Actual Output:', target);
        console.log('---');
      }
  }
  draw(){
    const colors = []
    const outputs = this.trainingSet.map((set) => set.output);
    for (const output of outputs) {
      if (output === "1") {
        colors.push('red');
      } else if(output === "2"){
        colors.push('blue');
      } else {
        colors.push('orange');
      }
    }
    const data = [
      {
        x: this.trainingSet.map((set) => set.inputs[0]),
        y: this.trainingSet.map((set) => set.inputs[1]),
        type: "scatter",
        mode: 'markers',
        marker: {
          color:colors,
        }
      },
    ];
    const layout = {
      title: "Gráfico",
      xaxis:{ title: "Petal length" }, 
      yaxis:{ title: "Sepal length" },
    };
    plot(data, layout);
  }
  }
