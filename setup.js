let config = require('./config');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');

const questions = {
    releaseNotes: 'Where is your release notes file? ',
    releaseNotesTemplate: 'Where is your release notes template file? ',
    resolvedIssues: 'What is the selector for resolved issues? ',
    enhancements: 'What is the selector for enhancements? ',
    behavioralChanges: 'What is the selector for behavioral changes? '
};

module.exports.firstTimeSetup = async function() {
    config.pathToReleaseNotes = await getConfigItem(questions.releaseNotes);
    config.pathToReleaseNotesTemplate = await getConfigItem(questions.releaseNotesTemplate);
    config.selectorForResolvedIssues = await getConfigItem(questions.resolvedIssues);
    config.selectorForEnhancements = await getConfigItem(questions.enhancements);
    config.selectorForBehavioralChanges = await getConfigItem(questions.behavioralChanges);
    config.isNewInstall = false;

     fs.writeFile('./config.json', JSON.stringify(config), (err) => {
        if(err) {
            console.log("error updating package config!");
        }
        
        rl.close();
        process.stdin.destroy();
    });
}

async function getConfigItem(question) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
