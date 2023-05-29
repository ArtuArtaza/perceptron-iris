import Excel from "exceljs";
import Perceptron from "./src/perceptron";

const convertCSV = async (filename:string) => {
  const workbook = new Excel.Workbook();
  try {
    await workbook.csv.readFile(filename);
    const worksheet = workbook.getWorksheet(1);

    let data: { inputs: number[]; output: string }[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const inputs: number[] = [
        row.getCell(1).value as number,
        row.getCell(2).value as number,
        row.getCell(3).value as number,
        row.getCell(4).value as number,
      ];
      const outputRowValue = row.getCell(5).value?.toString();
      const output = outputRowValue?.replace("Iris-", "")
        .includes("setosa")
        ? "1"
        : outputRowValue?.replace("Iris-","").includes("versicolor") ? "2" : "3";
      data = [...data, { inputs, output }];
    });
    return data;
  } catch (error) {
    console.log("Error reading the CSV file:", error);
    return null;
  }
};

const run = async () => {
  const trainingSet = await convertCSV("./iris.csv");
  if(!trainingSet) return;
  const perceptron = new Perceptron(0.1, 0.5, 0.2, trainingSet);
  perceptron.train()
 // const testingSet = await convertCSV("./testing-dataset.csv")
  //if(!testingSet) return;
  perceptron.evaluate([{inputs:[4.9,3,1.4,0.2], output:"1"}])
  perceptron.evaluate([{inputs:[5,3.4,1.5,0.2], output:"1"}])
  perceptron.evaluate(trainingSet)
  //perceptron.draw()
};
run();
