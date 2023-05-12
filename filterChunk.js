const glob = require("glob");
const fs = require("fs");
const process = require("process");

let getData = () => {
  let result = [];
  for (let i = 1; i < 17; i++) {
    let data = fs.readFileSync(`./prepdata/chunk${i}.txt`, "utf-8");
    let content = JSON.parse(data);
    result.push(...content);
  }
  return result;
};
let setfiles = async () => {
  const [_, __, sourceHTML, sourceTEXT] = process.argv;
  const preData = getData();
  let HTMLfiles = await glob(`${sourceHTML}/**/*.html`);
  let preFix = HTMLfiles[0].split("/").slice(0, 2).join("/");
  let TEXTfiles = await glob(`${sourceTEXT}/**/*.txt`);

  TEXTfiles = TEXTfiles.filter((item) => {
    let data = String(item);
    if (data.includes("interview")) {
      return true;
    } else {
      return false;
    }
  });

  let content = TEXTfiles.map((item) => {
    let key = item.split("/").slice(2).join("/");
    key = preFix + "/" + key.slice(0, -4);
    let value = item;
    return key + " => " + value;
  });
  content = content.filter((item) => !preData.includes(item));
  let resFiles = 0;
  if (content.length > 10) {
    resFiles = parseInt(content.length / 10);
  } else {
    resFiles = 1;
  }
  let start = 0;
  for (let i = 0; i < resFiles; i++) {
    let data = content.slice(start, start + 10);
    fs.writeFileSync(
      `./prepdata33/chunk${i + 1}.txt`,
      JSON.stringify(data),
      "utf-8"
    );
    start += 10;
  }
  console.log("Completed Processing");
};

setfiles();
// console.log(getData());
