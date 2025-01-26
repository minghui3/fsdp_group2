const Repo = require("../models/repo.js");
const simpleGit = require("simple-git");
const fs = require("fs");
const Queue = require("bull"); 

const initRepos = (async() => {
    try {
        const repoArr = await Repo.find({});
        console.log(repoArr);

        const reposDir = simpleGit(("./repos")); 

        repoArr.forEach(async(r) => {
            if (!fs.existsSync("./repos/" + r.name)) {
                console.log(`[repo.js] Repo ${r.name} does not exist. Cloning ${r.url}...`);
                await reposDir.clone(r.url);
            } else {
                console.log(`[repo.js] Repo ${r.name} exists.`)
            }
        });
    }
    catch (err) {
        console.error(err);
    }
})();
