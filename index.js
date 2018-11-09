let setupUtilities = require('./setup');
let utilities = require('./utilities');
let config = require('./config');

const readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// const workingDirPath = '../EquiTrack/';
// const simpleGit = require('simple-git')(workingDirPath);

// const fs = require('fs');

// async function getUnpushedCommits() {
//     const unpushedCommitOptions = {from: 'origin/master', to: 'HEAD'};
//     return new Promise(resolve => {
//         simpleGit.log(unpushedCommitOptions, (err, log) => {
//             console.log('Here are your local commits: ');
//             for (const commit of log.all) {
//                 console.log(commit.message);
//             }
//             resolve();
//         }); 
//     });
// }

// async function getSectionContent(sectionName) {
//     return new Promise(resolve => {
//         rl.question(`Please enter the ${sectionName} this push includes (comma-separated list): `, (answer) => {
//             resolve(answer.split(','));
//         });
//     });
// }

// async function getReleaseNotesAsString(clearReleaseNotes, pathToReleaseNotes) {
//     return new Promise(resolve => {
//         const fileToRead = clearReleaseNotes ? './release-notes-orig.html' : `${pathToReleaseNotes}\\release-notes.component.html`;
//         console.log('File to read from: ', fileToRead);
//         fs.readFile(fileToRead, 'utf8', (err,data) => {
//             console.log('Got release notes!');
//             resolve(data);
//         });
//     });
// }

// async function writeReleaseNotes(pathToReleaseNotes, text) {
//     return new Promise(resolve => {
//         fs.writeFile(`${pathToReleaseNotes}\\release-notes.component.html`, text, (err) => {
//             resolve();
//         });
//     });
// }

// async function updateReleaseNotes(releaseNotesString, resolvedIssuesItems, enhancementsItems, behavioralChangesItems) {
//     return new Promise(resolve => {
//         const $ = cheerio.load(releaseNotesString);

//         for (const item of resolvedIssuesItems) {
//             $('#resolved-issues-list').append(`    <li>${item}</li>\n`);
//         }

//         for (const item of enhancementsItems) {
//             $('#enhancements-list').append(`    <li>${item}</li>\n`);
//         }

//         for (const item of behavioralChangesItems) {
//             $('#behavioral-changes-list').append(`    <li>${item}</li>\n`);
//         }
        
//         resolve($.html());
//     });
// }

// async function pushToRemote() {
//     return new Promise(resolve => {
//         simpleGit.add('*')
//             .commit('updated release notes with help from whats-new')
//             // TODO: push should be automated?
//             // .push('origin', 'master')
//             .exec(() => {
//                 resolve();
//             });
//     });
// }

async function main() {
    await setupUtilities.setupConfig(rl);

    const pathToReleaseNotes = config.pathToReleaseNotes;
    const clearReleaseNotes = await utilities.getShouldClearReleaseNotes(rl);

    // await getUnpushedCommits();

    // const resolvedIssuesList = await getSectionContent('resolved issues');
    // const enhancementsList = await getSectionContent('enhancements');
    // const behavioralChangesList = await getSectionContent('behavioral changes');

    // const releaseNotesString = await getReleaseNotesAsString(pathToReleaseNotes, clearReleaseNotes);

    // const newReleaseNotesString = await updateReleaseNotes(releaseNotesString, resolvedIssuesList, enhancementsList, behavioralChangesList);
    // await writeReleaseNotes(pathToReleaseNotes, newReleaseNotesString);
    // console.log("done updating release notes");

    // await pushToRemote();
    // console.log("all pushed! stopping now");

    rl.close();
    process.stdin.destroy();
}

main();