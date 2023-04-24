require("dotenv").config();
const fs = require("fs");
const process = require("process");
const { Configuration, OpenAIApi } = require("openai");
const mkdirp = require("mkdirp");

const configuration = new Configuration({
  apiKey: process.env.KKEY
});
const parser = require("posthtml-parser");
const render = require("posthtml-render");

const htmlToJson = (sourceFile) => {
  try {
    let htmldemo = fs.readFileSync(sourceFile, "utf8");
    let parsedData = parser.parser(htmldemo);
    return parsedData;
  } catch (error) {
    console.log(error);
  }
};

const paraphrase = async (sourceFile, outfile, filename) => {
  try {
    const openai = new OpenAIApi(configuration);
    let textOnlyList = [],
      textList = [],
      results = [];
    let data = fs.readFileSync(sourceFile, "utf-8");
    data = data.split("\n");
    let lines = 0;
    data.forEach((item) => {
      let [tag, content] = item.split(" => ");
      let contentText =
        content != undefined && content.trim().split(" ").length > 5
          ? content.trim().slice(1, -1)
          : "";
      if (contentText != "") {
        lines++;
        textOnlyList.push(contentText);
        textList.push([tag, content]);
      }
    });
    console.log(lines);
    for (let x = 0; x < textOnlyList.length; x += 1) {
      let processedData = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: textOnlyList[x]
          },
          {
            role: "user",
            content: "Rephrase this content so that it's not plagiarised."
          }
        ]
      });
      let generatedData = {
        tag: textList[x][0],
        original: textOnlyList[x],
        result: processedData.data.choices[0].message.content
      };
      results.push(generatedData);
    }
    writeParsedData(outfile, filename, results);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const writeParsedData = async (outfile, filename, results) => {
  const filepath = "./parsedData/" + outfile;
  await mkdirp(filepath);
  fs.writeFileSync(
    filepath + "/" + filename + ".json",
    JSON.stringify(results),
    "utf8"
  );
};

const findNestedObj = (tree, dataValue) => {
  let data = JSON.stringify(tree, (_, nestedValue) => {
    if (
      nestedValue &&
      nestedValue !== undefined &&
      nestedValue.content &&
      nestedValue.content.length === 1 &&
      typeof nestedValue.content[0] === "string"
    ) {
      let findData = dataValue.filter(
        (item) =>
          item.tag === nestedValue.tag &&
          item.original.trim() === nestedValue.content[0].trim()
      );
      if (findData.length > 0) {
        nestedValue.content = [findData[0].result];
      }
    }
    return nestedValue;
  });

  data = JSON.parse(data);
  return data;
};

const writeHtmlFile = async (tree, path, filename) => {
  const html = render.render(tree);
  const filepath = "./result/" + path;
  await mkdirp(filepath);
  fs.writeFileSync(filepath + "/" + filename, html, "utf8");
};
module.exports = { htmlToJson, paraphrase, findNestedObj, writeHtmlFile };
