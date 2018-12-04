// TODO:
    // Change config?
    // Tests!

const setupUtilities = require('./setup');
const utilities = require('./utilities');
const config = require('./config');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    await setupUtilities.setupConfig(rl);

    const pathToReleaseNotes = config.pathToReleaseNotes;
    const clearReleaseNotes = await utilities.getShouldClearReleaseNotes(rl);

    const thisShouldBeWorkingDirectory = 'C:\\Git\\EquiTrack\\';
    await utilities.getUnpushedCommits(thisShouldBeWorkingDirectory);

    const resolvedIssuesList = await utilities.getSectionContent(rl, 'resolved issues');
    const enhancementsList = await utilities.getSectionContent(rl, 'enhancements');
    const behavioralChangesList = await utilities.getSectionContent(rl, 'behavioral changes');

    const releaseNotesString = await utilities.getReleaseNotesAsString(clearReleaseNotes, pathToReleaseNotes);

    const newReleaseNotesString = await utilities.updateReleaseNotes(releaseNotesString, config.productName, config.versionNumber, 
        config.creator, resolvedIssuesList, enhancementsList, behavioralChangesList);

    await utilities.writeReleaseNotes(pathToReleaseNotes, newReleaseNotesString);
    await utilities.pushToRemote(thisShouldBeWorkingDirectory);

    rl.close();
    process.stdin.destroy();
}

main();