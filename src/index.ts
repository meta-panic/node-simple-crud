import "dotenv/config";

import getAppArgs from "./utils/ArgParser";


const args = getAppArgs(process.argv, "mode");

if (args === "single") {
  await import("./runSingle");
} else if (args === "multi") {
  await import("./runMulti");
} else {
  console.error("Incorrect app arguments:", args);
}
