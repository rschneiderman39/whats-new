const questions = {
    productName: "What is the name of your product? ",
    versionNumber: "What version are you on? ",
    creator: "Who is the creator? ",
    releaseNotes: 'Where is your release notes file? (ex - C:\\User\\MyProject\\release-notes.html) ',
    reposToWatch: "Enter (comma separated) absolute paths to any other repos you would like to watch:  "
};

let config;

module.exports.setupConfig = async function(rl) {
    const chalk = require('chalk');
    const fs = require('fs');

    let newInstall = false; 

    await getConfigFile();

    if(config.isNewInstall) { 
        newInstall = true;

        console.log(chalk.magenta.underline.bold("Welcome! Let's get to know each other... \n"));

        config.isNewInstall = false;
        config.productName = await getConfigItem(rl, questions.productName);
        config.creator = await getConfigItem(rl, questions.creator);
        config.pathToReleaseNotes = await getConfigItem(rl, questions.releaseNotes);

        let repos = await getConfigItem(rl, questions.reposToWatch);
        if(repos.trim().length === 0) {
            config.reposToWatch = [];
        } else {
            config.reposToWatch = repos.split(',');
        }
    }

    config.versionNumber = await getConfigItem(rl, questions.versionNumber);

    return new Promise(resolve => {
        fs.writeFile(`${process.cwd()}\\whats-new-config.json`, JSON.stringify(config), (err) => {
            if(err) {
                console.log("error updating config!");
            }
            resolve(newInstall);
        });
    });
}

async function getConfigItem(rl, question) {
    const chalk = require('chalk');

    return new Promise(resolve => {
        rl.question(chalk.cyanBright(question), (answer) => {
            resolve(answer);
        });
    });
}

async function getConfigFile() {
    const localConfigPath = `${process.cwd()}\\whats-new-config.json`;

    return new Promise(resolve => {
        const fs = require('fs');

        fs.access(localConfigPath, fs.F_OK, (err) => {
            if (err) {
                config = require(`${__dirname}\\config.json`);
                resolve();

            } else {
                config = require(`${process.cwd()}\\whats-new-config.json`);
                resolve();
            }
        }); 
    });
}