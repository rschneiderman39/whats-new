let config = require('./config');
const fs = require('fs');

const questions = {
    releaseNotes: 'Where is your release notes file? ',
    releaseNotesTemplate: 'Where is your release notes template file? ',
    resolvedIssues: 'What is the selector for resolved issues? ',
    enhancements: 'What is the selector for enhancements? ',
    behavioralChanges: 'What is the selector for behavioral changes? '
};

module.exports.setupConfig = async function(rl) {
    config.pathToReleaseNotes = await getConfigItem(rl, questions.releaseNotes);
    config.pathToReleaseNotesTemplate = await getConfigItem(rl, questions.releaseNotesTemplate);
    config.selectorForResolvedIssues = await getConfigItem(rl, questions.resolvedIssues);
    config.selectorForEnhancements = await getConfigItem(rl, questions.enhancements);
    config.selectorForBehavioralChanges = await getConfigItem(rl, questions.behavioralChanges);
    config.isNewInstall = false;

     fs.writeFile('./config.json', JSON.stringify(config), (err) => {
        if(err) {
            console.log("error updating package config!");
        }
    });
}

async function getConfigItem(rl, question) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
