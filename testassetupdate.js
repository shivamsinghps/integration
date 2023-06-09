const glob = require("glob");
const fs = require("fs");
const process = require("process");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mkdirp = require("mkdirp");

let setfiles = async () => {
  const [_, __, sourceHTMLs] = process.argv;
  let HTMLfiles = await glob(`${sourceHTMLs}/**/*.html`);
  for (const item of HTMLfiles) {
    await processHtmlToText(item);
    console.log(item + "done");
  }
  console.log("Completed");
};

const processHtmlToText = async (inputFile) => {
  try {
    let data = fs.readFileSync(inputFile, "utf-8");
    let dom = new JSDOM(data);

    let imgblocks = dom.window.document.querySelectorAll("img");

    imgblocks.forEach((val) => {
      let data = val.getAttribute("src");
      if (data !== null) {
        console.log("1");
        let newLink = data.replace("https://static.javatpoint.com", "/Assets");
        val.setAttribute("src", newLink);
      }
      let data2 = val.getAttribute("data-src");
      if (data2 !== null) {
        console.log("2");
        let newLink = data2.replace(
          "https://static.javatpoint.com",
          "Assets"
        );
        val.removeAttribute("data-src");

        val.setAttribute("src", newLink);
      }
    });
    fs.writeFileSync(inputFile, dom.serialize(), "utf-8");
  } catch (error) {
    console.log(error);
    return;
  }
};

setfiles();
// processHtmlToText("./result2/ab-initio-interview-questions.html");
