import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "key.json"), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };