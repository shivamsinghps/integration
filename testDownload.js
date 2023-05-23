const fs = require("fs");
const mkdirp = require("mkdirp");
const https = require("https");

const downloadandWriteAsset = async (url = null, dir, path, filename) => {
  try {
    let localpath = await getPath(dir, path, filename);
    https.get(url, (response) => {
      response.pipe(localpath);
    });
  } catch (error) {
    console.log({ downloadError: error });
  }
};

const getPath = async (dir, path, filename) => {
  await mkdirp(dir + path);
  return fs.createWriteStream(dir + path + "/" + filename);
};

const processAssets = async () => {
  try {
    const data = fs.readFileSync("./demo2/Assets.txt", "utf-8");
    let assetList = data.split("\n");
    for (let i = 0; i < assetList.length; i++) {
      let newPath = assetList[i].replace("https://static.javatpoint.com/", "");
      let values = newPath.split("/");
      console.log({ values, newPath, i });
      let filename = values[values.length - 1];
      let path = values.slice(0, -1).join("/");
      await downloadandWriteAsset(assetList[i], "./Assets/", path, filename);
      console.log("Completed " + i);
    }
    console.log("Completed the downloading of assets");
  } catch (error) {
    console.log({ mainError: error });
  }
};

processAssets();
