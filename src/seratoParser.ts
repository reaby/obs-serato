import { Buffer } from "buffer";
import * as fs from "fs";
import * as glob from "glob";
import { homedir } from "os";

interface songData {
  status: boolean;
  song: string;
  artist: string;
  byte: number;
}

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

  getCurrent(file: string) {
    const data = fs.readFileSync(file).toString();
    const tracks = data.split("oent");
    const songs: songData[] = [];
    const cache: any = {};

    for (const byt of tracks) {
      let status = true;
      if (
        byt.indexOf("\u0000\u0000\u0000-") > 0 ||
        byt.indexOf("\u0000\u0000\u0000\u0003") > 0
      ) {
        status = false;
      }

      const start = byt.indexOf("\u0000\u0000\u0006");
      let end = -1;
      if (start > 0) {
        end = byt.indexOf("\u0000\u0007");
        if (end == -1) {
          end = byt.indexOf("\u0000\u0000\u0000\u0008");
        }
        if (end == -1) {
          end = byt.indexOf("\u0000\u0000\u0000\t");
        }
        if (end == -1) {
          end = byt.indexOf("\u0000\u0000\u0000\u000f");
        }
      }

      const aStart = byt.indexOf("\u0000\u0000\u0000\u0007");
      let aEnd = -1;
      if (aStart > 0) {
        aEnd = byt.indexOf("\u0000\u0000\u0000\u0000\u0008");
        if (aEnd == -1) aEnd = byt.indexOf("\u0000\u0000\u0000\u0000\t");
        if (aEnd == -1) aEnd = byt.indexOf("\u0000\u0000\u0000\u0000\u000f");
      }

      let song = "-";
      if (start > 0) {
        song = byt.substr(start + 8, end - start - 8).replace(/\u0000/g, "");
        let artist = "-";
        if (aStart > 0) {
          artist = byt
            .substr(aStart + 8, aEnd - aStart - 8)
            .replace(/\u0000/g, "");
        }

        const statusByte = Buffer.from(byt.substr(3, 1)).readUInt8(0);
        const songData = {
          status: status,
          song: song,
          artist: artist,
          byte: statusByte,
        };
        songs.push(songData);

        const id: string = song + artist;
      //  console.log(id + ": " + statusByte);             
        if (status == true) {
          if (!cache.hasOwnProperty(id)) {
            cache[id] = [songData];
          } else {
            cache[id].push(songData);
          }
        } else {
          try {
            cache[id].pop();
            if (cache[id].length == 0) {
              delete cache[id];
            }
          } catch (e) {
            // silent error
            // console.log(e);
          }
        }
      }
    }
    
    const out = [];
    for (const song in cache) {
      out.push(cache[song][0]);
    }

    if (out.length > 0) {
      return { song: out[0].song, artist: out[0].artist };
    } else {
      return { song: "", artist: "" };
    }
  }

  parse() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const newestFile: string = glob
      .sync(this.home + "/*.session")
      .map((name: any) => ({ name, ctime: fs.statSync(name).ctime }))
      .sort((a: any, b: any) => b.ctime - a.ctime)[0].name;

    return this.getCurrent(newestFile);
  }
}

export default SeratoParser;
