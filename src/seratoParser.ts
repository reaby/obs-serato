/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as glob from "glob";
import { homedir } from "os";
import * as fs from "fs";
const BufferHelper = require("seratohistory/lib/bufferHelper.js");
const { HISTORY_FIELDS } = require("seratohistory/lib/definitions.js");
const pick = (obj: any, arr: any) =>
  arr.reduce(
    (acc: any, curr: any) => (curr in obj && (acc[curr] = obj[curr]), acc),
    {}
  );

// const diff = (a: any, b: any) => a.filter((v: any) => !b.includes(v));

class SeratoParser {
  public home = "";

  constructor() {
    const home = homedir();
    const dirs = [
      "/Music/ScratchLIVE/History/Sessions",
      "/Music/_Serato_/History/Sessions",
    ];

    for (const dir of dirs) {
      const dhome = `${home}/${dir}`;
      if (fs.existsSync(dhome)) {
        this.home = dhome;
      }
    }
  }

  async getCurrent(file: string): Promise<any> {
    const buffer = await fs.promises.readFile(file);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const chunks: any = await BufferHelper.parseChunkArray(
      buffer,
      0,
      buffer.length
    );
    const cache: any = {};

    for (const i in chunks) {
      const chunk: any = chunks[i];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (chunk instanceof Object) {
        if (chunk["\x00\x00\x00F"] === "\x01") {
          delete cache[chunk.filePath];
          continue;
        }
        if (Object.keys(cache).includes(chunk.filePath)) {
          delete cache[chunk.filePath];
        } else {
           cache[chunk.filePath] = pick(chunk, HISTORY_FIELDS);          
          //cache[chunk.filePath] = chunk;
        }
      }
    }

    const out = [];
    for (const o in cache) {
      out.push(cache[o]);
    }

    if (out.length >= 1) {
      return out[0];
    } else {
      return { title: "-", artist: "-" };
    }
  }

  async parse(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const newestFile: string = glob
      .sync(this.home + "/*.session")
      .map((name: any) => ({ name, ctime: fs.statSync(name).ctime }))
      .sort((a: any, b: any) => b.ctime - a.ctime)[0].name;
    return await this.getCurrent(newestFile);
  }
}

export default SeratoParser;
