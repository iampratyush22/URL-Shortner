const http = require('http');

const url = 'http://localhost:10000/r/9';
const totalRequests = 100000;
const batchSize = 100; // Number of concurrent requests

let completed = 0;
let failed = 0;

async function run() {
    console.log(`Starting load test: ${totalRequests} requests to ${url} in batches of ${batchSize}...`);

    for (let i = 0; i < totalRequests; i += batchSize) {
        const batch = [];
        for (let j = 0; j < batchSize && i + j < totalRequests; j++) {
            batch.push(
                new Promise((resolve) => {
                    http.get(url, (res) => {
                        res.on('data', () => { }); // Consume data to free memory
                        res.on('end', () => resolve(true));
                    }).on('error', () => resolve(false));
                })
            );
        }

        const results = await Promise.all(batch);
        completed += results.filter(r => r).length;
        failed += results.filter(r => !r).length;

        if ((i + batchSize) % 1000 === 0 || (i + batchSize) >= totalRequests) {
            console.log(`Processed ${completed + failed} / ${totalRequests} (Successful: ${completed}, Failed: ${failed})`);
        }
    }

    console.log('\n--- Load test finished! ---');
    console.log(`Total successful: ${completed}`);
    console.log(`Total failed: ${failed}`);
}

run();
