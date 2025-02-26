const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers equal to the number of CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart workers on exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
    });

} else {
    // Worker processes
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}

