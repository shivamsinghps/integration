const glob = require("glob");
const fs = require("fs");
const process = require("process");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mkdirp = require("mkdirp");

let setfiles = async () => {
  const [_, __, sourceHTMLs, outPath] = process.argv;
  let HTMLfiles = await glob(`${sourceHTMLs}/**/*.html`);
  for (const item of HTMLfiles) {
    await processHtmlToText(item, outPath);
  }
  console.log("Completed");
};

const processHtmlToText = async (
  inputFile = "./result/adobe-interview-questions.html",
  outPath = "./demo2"
) => {
  try {
    let result = "";
    let data = fs.readFileSync(inputFile, "utf-8");
    let dom = new JSDOM(data);

    let imgblocks = dom.window.document.querySelectorAll("img");

    imgblocks.forEach((val) => {
      let data = val.getAttribute("data-src");
      if (data !== null && data.includes("http")) {
        result = result + val.getAttribute("data-src") + "\n";
      }
    });
    await writeFile(outPath, "AssetsLazy", result);
  } catch (error) {
    console.log(error);
    return;
  }
};

const writeFile = async (path, filename, content) => {
  try {
    await mkdirp(path);
    fs.appendFileSync(path + "/" + filename + ".txt", content, "utf-8");
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

setfiles();
