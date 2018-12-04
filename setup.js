const questions = {
    productName: "What is the name of your product? ",
    versionNumber: "What version are you on? ",
    creator: "Who is the creator? ",
    releaseNotes: 'Where is your release notes file? (ex - C:\\User\\Git\\MyProject\\release-notes.html) ',
};

module.exports.setupConfig = async function(rl) {
    const fs = require('fs');
    const config = require('./config');
    
    if(config.isNewInstall) { 
        config.isNewInstall = false;
        config.productName = await getConfigItem(rl, questions.productName);
        config.creator = await getConfigItem(rl, questions.creator);
        config.pathToReleaseNotes = await getConfigItem(rl, questions.releaseNotes);
    }

    config.versionNumber = await getConfigItem(rl, questions.versionNumber);

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