#!/usr/bin/env node

// TODO:
    // Read version from package.json?
    // Change config?
    // Tests!

const setupUtilities = require('./setup');
const utilities = require('./utilities');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    const workingDirectory = process.cwd();

    await setupUtilities.setupConfig(rl);
    const config = require(`${process.cwd()}\\whats-new-config.json`);

    const clearReleaseNotes = await utilities.getShouldClearReleaseNotes(rl);
    const pathToReleaseNotes = config.pathToReleaseNotes;

    await utilities.getUnpushedCommits(workingDirectory);
    for (const repo of config.reposToWatch) {
        await utilities.getUnpushedCommits(repo);
    }

    const resolvedIssuesList = await utilities.getSectionContent(rl, 'resolved issues');
    const enhancementsList = await utilities.getSectionContent(rl, 'enhancements');
    const behavioralChangesList = await utilities.getSectionContent(rl, 'behavioral changes');

    const releaseNotesString = await utilities.getReleaseNotesAsString(clearReleaseNotes, pathToReleaseNotes);

    const newReleaseNotesString = await utilities.updateReleaseNotes(releaseNotesString, config.productName, 
        config.versionNumber, config.creator, resolvedIssuesList, enhancementsList, behavioralChangesList);

    await utilities.writeReleaseNotes(pathToReleaseNotes, newReleaseNotesString);

    await utilities.pushToRemote(workingDirectory);

    rl.close();
    process.stdin.destroy();

    process.exit(0);
};

main();
