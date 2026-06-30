import { JSONRPCMessage } from "@modelcontextprotocol/server";
/* @mcp-codemod-error @modelcontextprotocol/server/stdio is ESM-only and this project is CommonJS, so this static import fails at load (ERR_PACKAGE_PATH_NOT_EXPORTED). "StdioServerTransport" is used in a synchronous context (line 6) that cannot await a dynamic import. Restructure so the value loads inside an async function (then re-run to auto-convert), or migrate the project to ESM. See docs/migration/upgrade-to-v2.md. */
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { appendFileSync } from "fs";
import { appendFile } from "fs/promises";

export class LoggingStdioServerTransport extends StdioServerTransport {
  path: string;

  constructor(path: string) {
    super();
    this.path = path;
    appendFileSync(path, "--- new process start ---\n");
    const origOnData = this._ondata;
    this._ondata = (chunk: Buffer) => {
      origOnData(chunk);
      appendFileSync(path, chunk.toString(), { encoding: "utf8" });
    };
  }

  async send(message: JSONRPCMessage) {
    await super.send(message);
    await appendFile(this.path, JSON.stringify(message) + "\n");
  }
}
