const fs = require("fs");

const processHexChunks = (hexChunks) => {
  hexChunks.forEach((hexChunk) => {
    const hexString = hexChunk.toString("hex");
    const moovIndex = hexString.indexOf("6d6f6f76", 0, "hex"); // "moov"
    if (moovIndex === -1) {
      console.error("moov box not found in the hex string");
      return;
    }

    const moovBox = hexString.slice(moovIndex);
    const moovOffset = moovIndex * 2; // Convert the index to byte offset
    const gpsOffset = findGPSOffset(moovBox, moovOffset);
    if (gpsOffset === -1) {
      console.error("gps box not found in the moov box");
      return;
    }

    const gpsDataOffset = gpsOffset + 12;
    const gpsData = hexString.slice(gpsDataOffset, gpsDataOffset + 40);
    const decodedString = Buffer.from(gpsData, "hex").toString("utf-8");

    const latitude = parseFloat(decodedString.slice(0, 10));
    const longitude = parseFloat(decodedString.slice(10, 20));

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  });
};

const findGPSOffset = (moovBox, moovOffset) => {
  const trakIndex = moovBox.indexOf("7472616b", 0, "hex"); // "trak"
  if (trakIndex === -1) {
    console.error("trak box not found in the moov box");
    return -1;
  }

  const trakBox = moovBox.slice(trakIndex);
  const mdiaIndex = trakBox.indexOf("6d646961", 0, "hex"); // "mdia"
  if (mdiaIndex === -1) {
    console.error("mdia box not found in the trak box");
    return -1;
  }

  const mdiaBox = trakBox.slice(mdiaIndex);
  const minfIndex = mdiaBox.indexOf("6d696e66", 0, "hex"); // "minf"
  if (minfIndex === -1) {
    console.error("minf box not found in the mdia box");
    return -1;
  }

  const minfBox = mdiaBox.slice(minfIndex);
  const stblIndex = minfBox.indexOf("7374626c", 0, "hex"); // "stbl"
  if (stblIndex === -1) {
    console.error("stbl box not found in the minf box");
    return -1;
  }

  const stblBox = minfBox.slice(stblIndex);
  const stsdIndex = stblBox.indexOf("73747364", 0, "hex"); // "stsd"
  if (stsdIndex === -1) {
    console.error("stsd box not found in the stbl box");
    return -1;
  }

  const stsdBox = stblBox.slice(stsdIndex);
  const gpsIndex = stsdBox.indexOf("67707320", 0, "hex"); // "gps "
  if (gpsIndex === -1) {
    console.error("gps box not found in the stsd box");
    return findGPSOffset(moovBox, moovOffset + trakIndex * 2 + mdiaIndex * 2 + minfIndex * 2 + stblIndex * 2 + stsdIndex * 2);
  }

  const gpsOffset = moovOffset + trakIndex * 2 + mdiaIndex * 2 + minfIndex * 2 + stblIndex * 2 + stsdIndex * 2 + gpsIndex * 2;
  return gpsOffset;
};

const readFileInChunks = (filePath, chunkSize) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const fileStream = fs.createReadStream(filePath, {
      highWaterMark: chunkSize,
    });

    fileStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    fileStream.on("error", (error) => {
      reject(error);
    });

    fileStream.on("end", () => {
      resolve(chunks);
    });
  });
};

const extractGPSCoordinates = async (filePath, chunkSize = 1024 * 1024 * 10) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error("Error: The MP4 file does not exist.");
      return;
    }

    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;

    let offset = 0;
    let remainingBytes = fileSize;

    while (remainingBytes > 0) {
      const readBytes = Math.min(chunkSize, remainingBytes);

      const chunks = await readFileInChunks(filePath, readBytes);

      processHexChunks(chunks);

      offset += readBytes;
      remainingBytes -= readBytes;
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

module.exports = {
  extractGPSCoordinates,
};
