const Repo = require("../models/repo.js");
const simpleGit = require("simple-git");
const fsPromises = require("fs").promises;

(async () => {
    try {
        const repoArr = await Repo.find({});
        console.log(repoArr);

        try {
            await fsPromises.access("./repos");
        }
        catch {
            await fsPromises.mkdir("./repos")
        }
        const reposDir = simpleGit(("./repos"));

        await Promise.all(repoArr.map(async (r) => {
            console.log(r.name);
            try {
                await fsPromises.access(`./repos/${r.name}`);
            }
            catch {
                await reposDir.clone(r.url);
            }
        }));
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        throw (err);
    }
})();
