const glob = require("glob");
const fs = require("fs");
const process = require("process");

let setfiles = async () => {
  const [_, __, sourceHTML, sourceTEXT] = process.argv;

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
  let resFiles = 0;
  if (TEXTfiles.length > 20) {
    resFiles = parseInt(TEXTfiles.length / 20);
  } else {
    resFiles = 1;
  }
  let start = 0;
  for (let i = 0; i < resFiles; i++) {
    let data = content.slice(start, start + 20);
    fs.writeFileSync(
      `./prepdata/chunk${i + 1}.txt`,
      JSON.stringify(data),
      "utf-8"
    );
    start += 20;
  }
  console.log("Completed Processing");
};

setfiles();
