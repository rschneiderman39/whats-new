const readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const workingDirPath = "../EquiTrack/";
const simpleGit = require("simple-git")(workingDirPath);

const fs = require('fs');
const cheerio = require('cheerio');

async function getShouldClearReleaseNotes() {
    return new Promise(resolve => {
        rl.question('Would you like to clear current content from release-notes? ', (answer) => {
            if(answer.toLocaleLowerCase() === 'y') 
            {
                console.log("ok! clearing now.");
                resolve();
            }
            else 
            {
                console.log("got it, leaving them alone.");
                resolve();
            }
        });
    });
}

async function getUnpushedCommits() {
    const unpushedCommitOptions = {from: "origin/master", to: "HEAD"};
    return new Promise(resolve => {
        simpleGit.log(unpushedCommitOptions, (err, log) => {
            console.log("Here are your local commits: ");
            for (const commit of log.all) {
                console.log(commit.message);
            }
            resolve();
        }); 
    });
}

async function getSectionContent(sectionName) {
    return new Promise(resolve => {
        rl.question(`Please enter the ${sectionName} this push includes (comma-separated list): `, (answer) => {
            resolve(answer.split(","));
        });
    });
}

async function getReleaseNotesAsString() {
    return new Promise(resolve => {
        fs.readFile('./release-notes-orig.html', 'utf8', (err,data) => {
            resolve(data);
        });
    });
}

async function writeReleaseNotes(text) {
    return new Promise(resolve => {
        fs.writeFile('./release-notes-done.html', text, (err) => {
            console.log("release notes have been updated!");
            resolve();
        });
    });
}

async function updateReleaseNotes(releaseNotesString, resolvedIssuesItems, enhancementsItems, behavioralChangesItems) {
    return new Promise(resolve => {
        const $ = cheerio.load(releaseNotesString);

        for (const item of resolvedIssuesItems) {
            $('#resolved-issues-list').append(`    <li>${item}</li>\n`);
        }

        for (const item of enhancementsItems) {
            $('#enhancements-list').append(`    <li>${item}</li>\n`);
        }

        for (const item of behavioralChangesItems) {
            $('#behavioral-changes-list').append(`    <li>${item}</li>\n`);
        }
        
        resolve($.html());
    });
}

async function pushToRemote() {
    simpleGit.add('*')
        .commit("updated release notes with help from whats-new")
        .push('origin', 'master');
}

// TODO: read release notes from WORKING DIRECTORY of git project!!!
async function main() {
    await getShouldClearReleaseNotes();
    await getUnpushedCommits();

    const resolvedIssuesList = await getSectionContent("resolved issues");
    const enhancementsList = await getSectionContent("enhancements");
    const behavioralChangesList = await getSectionContent("behavioral changes");

    const releaseNotesString = await getReleaseNotesAsString();

    // update release-notes.html
    const newReleaseNotesString = await updateReleaseNotes(releaseNotesString, resolvedIssuesList, enhancementsList, behavioralChangesList);
    await writeReleaseNotes(newReleaseNotesString);

    // prompt for git push
    await pushToRemote();

    rl.close();
    process.stdin.destroy();
}

main();

///////////////////////////////////////////////////////////
// getVersionNumber();
