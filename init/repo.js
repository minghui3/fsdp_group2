const Repo = require("../models/repo.js");
const simpleGit = require("simple-git");
const fsPromises = require("fs").promises;

(async() => {
    try {
        const repoArr = await Repo.find({});
        console.log(repoArr);

        const reposDir = simpleGit(("./repos")); 

        repoArr.forEach(async(r) => {
            const exists = await fsPromises.access(`./repos/${r.name}`);
            if (!exists) {
                console.log(`[repo.js] Repo ${r.name} does not exist. Cloning ${r.url}...`);
                await reposDir.clone(r.url);
            } else {
                console.log(`[repo.js] Repo ${r.name} exists.`)
            }
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
    finally {
        process.exit(0);
    }
})();
