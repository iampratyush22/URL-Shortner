import zookeeper from "node-zookeeper-client";

export function ensurePath(
  client: zookeeper.Client,
  path: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    client.mkdirp(path, (error) => {
      if (error) return reject(error);
      console.log(`✅ ZNode ensured: ${path}`);
      resolve();
    });
  });
}
