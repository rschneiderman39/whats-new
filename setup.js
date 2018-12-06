const questions = {
    productName: "What is the name of your product? ",
    versionNumber: "What version are you on? ",
    creator: "Who is the creator? ",
    releaseNotes: 'Where is your release notes file? (ex - C:\\User\\MyProject\\release-notes.html) ',
    //reposToWatch: "Enter the absolute paths to all repositories I should track for you (comma separated) "
};

module.exports.setupConfig = async function(rl) {
    const fs = require('fs');
    const config = require('./config');
    
    if(config.isNewInstall) { 
        console.log("WELCOME! Let's get to know each other!");

        config.isNewInstall = false;
        config.productName = await getConfigItem(rl, questions.productName);
        config.creator = await getConfigItem(rl, questions.creator);
        config.pathToReleaseNotes = await getConfigItem(rl, questions.releaseNotes);
        //config.reposToWatch = await getConfigItem(rl, questions.reposToWatch);
    }

    config.versionNumber = await getConfigItem(rl, questions.versionNumber);

    fs.writeFile(`${__dirname}\\config.json`, JSON.stringify(config), (err) => {
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