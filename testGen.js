const generatorFunction = require("./testgenFunc");
const fs = require("fs");
const process = require("process");

const reader = async () => {
  console.time("completed");

  try {
    const [_, __, file] = process.argv;

    const dataMap = fs.readFileSync(file, "utf-8");
    let Map = JSON.parse(dataMap);
    for (const element of Map) {
      let [key, value] = element.split(" => ");
      const outPath = key.split("/").slice(2, -1).join("/");
      const filename = key.split("/").slice(-1);
      let treeData = generatorFunction.htmlToJson(key);
      let rephrasedData = await generatorFunction.paraphrase(
        value,
        outPath,
        filename
      );
      const generatedData = generatorFunction.findNestedObj(
        treeData,
        rephrasedData
      );
      await generatorFunction.writeHtmlFile(generatedData, outPath, filename);
    }
    console.timeEnd("completed");
  } catch (error) {
    console.timeEnd("completed");
    console.log(error.message);
  }
};

reader();
