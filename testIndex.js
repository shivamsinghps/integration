const glob = require("glob");
const fs = require("fs");
const process = require("process");
const generatorFunction = require("./testgenFunc");

let setfiles = async () => {
  const [_, __, sourceHTMLs, sourceHTML] = process.argv;

  let HTMLfiles = await glob(`${sourceHTMLs}/**/*.html`);

  const linkData = HTMLfiles.map((item) => {
    let name = item.split("\\").slice(-1);
    let linkName = name[0].split(".")[0];
    return linkName;
  });

  let treeData = generatorFunction.htmlToJson(sourceHTML);
  const generatedData = generatorFunction.linkReplacer(treeData, linkData);
  await generatorFunction.writeHtmlFile(
    generatedData,
    '',
    "index_gen.html"
  );
};

setfiles();
