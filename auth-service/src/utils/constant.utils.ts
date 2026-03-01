import fs from "fs";
import path from "path";

export const PRIVATE_KEY = fs.readFileSync(
    path.join(__dirname, "../keys/private.key"),
    "utf8"
);

const PUBLIC_KEY = fs.readFileSync(
    path.join(__dirname, "../keys/public.key"),
    "utf8"
);
