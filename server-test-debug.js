import "dotenv/config.js";

import analyzer from "#analyzer";
import { init } from "#dbs";

const db = await init();
const response = await analyzer(null, null, "fb64f43d3527a6a1370ccacdd10ee04b5c33ba77");

// console.log("test", response);
await db.disconnect();
