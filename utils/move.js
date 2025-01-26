const { warn } = require('console');
const fs = require('fs');
const fsPromises = fs.promises;

const move = async (oldPath, newPath, callback) => {
    await fsPromises.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    const copy = async () => {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', async() => {
            await fsPromises.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

module.exports = move;
