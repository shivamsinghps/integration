const generatorFunction = require("./testgenFunc");
const fs = require("fs");
const process = require("process");

// const reader = (source) => {
//   let treeData = generatorFunction.htmlToJson(source);
//   fs.writeFileSync("./htmljson.json", JSON.stringify(treeData), "utf-8");
//   console.log("done");
// };

const reader = async () => {
  try {
    for (let fileno = 13; fileno <= 15; fileno++) {
      let file = `./prepdata33/chunk${fileno}.txt`;
      console.time("completed");
      console.log(file, "started");
      const dataMap = fs.readFileSync(file, "utf-8");
      let Map = JSON.parse(dataMap);
      for (const element of Map) {
        let [key, value] = element.split(" => ");
        const outPath = key.split("/").slice(2, -1).join("/");
        const filename = key.split("/").slice(-1);
        let treeData = generatorFunction.htmlToJson(key);
        console.log("json Generated");
        let rephrasedData = await generatorFunction.paraphrase(
          value,
          outPath,
          filename
        );
        console.log("rephrasing done");
        const generatedData = generatorFunction.findNestedObj(
          treeData,
          rephrasedData
        );
        await generatorFunction.writeHtmlFile(generatedData, outPath, filename);
      }
      console.log(file, "processed");
      console.timeEnd("completed");
    }
  } catch (error) {
    console.log({ mainerror: error });
    console.timeEnd("completed");
  }
};

reader();
