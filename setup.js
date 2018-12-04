const questions = {
    releaseNotes: 'Where is your release notes file? (ex - C:\\User\\Git\\MyProject\\release-notes.html) ',
};

module.exports.setupConfig = async function(rl) {
    const config = require('./config');
    
    if(config.isNewInstall) {
        const fs = require('fs');
        
        config.pathToReleaseNotes = await getConfigItem(rl, questions.releaseNotes);
        config.isNewInstall = false;

        fs.writeFile('./config.json', JSON.stringify(config), (err) => {
            if(err) {
                console.log("error updating package config!");
            }
        });
    }
}

async function getConfigItem(rl, question) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}