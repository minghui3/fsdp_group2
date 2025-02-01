const { spawn } = require('child_process');

const run = (command, args = []) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { shell: true });

        let output = "";

        child.stdout.on("data", d => {
            output += d.toString();
        })

        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Command "${command}" exited with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
};

const runAndStream = (command, args = []) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit', shell: true });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command "${command}" exited with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
};

module.exports = { run, runAndStream };
