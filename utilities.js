module.exports.getShouldClearReleaseNotes = async function (rl) {
    return new Promise(resolve => {
        rl.question('Would you like to clear current content from release-notes? (y/n)', (answer) => {
            if (answer.toLocaleLowerCase() === 'y') {
                console.log('ok! clearing now.');
                resolve(true);
            }
            else {
                console.log('got it, leaving them alone.');
                resolve(false);
            }
        });
    });
};

module.exports.getUnpushedCommits = async function (workingDirPath) {
    const simpleGit = require('simple-git')(workingDirPath);
    const unpushedCommitOptions = {from: 'origin/master', to: 'HEAD'};

    return new Promise(resolve => {
        simpleGit.log(unpushedCommitOptions, (err, log) => {
            console.log('\n')
            console.log('Here are your local commits: ');
            for (const commit of log.all) {
                console.log(commit.message);
            }
            console.log('\n')
            resolve();
        }); 
    });
};

module.exports.getSectionContent = async function (rl, sectionName) {
    return new Promise(resolve => {
        rl.question(`Please enter the ${sectionName} this push includes (comma-separated list): `, (answer) => {
            if(answer.length === 0) {
                resolve([]);
            } else {
                resolve(answer.split(','));
            }
        });
    });
};

module.exports.getReleaseNotesAsString = async function (clearReleaseNotes, pathToReleaseNotes) {
    const fs = require('fs');

    return new Promise(resolve => {
        const fileToRead = clearReleaseNotes ? './release-notes-orig.html' : pathToReleaseNotes;
        fs.readFile(fileToRead, 'utf8', (err,data) => {
            resolve(data);
        });
    });
};

module.exports.updateReleaseNotes = async function (releaseNotesString, productName, versionNumber, 
    creator, resolvedIssuesItems, enhancementsItems, behavioralChangesItems) {
    return new Promise(resolve => {
        const cheerio = require('cheerio');
        const $ = cheerio.load(releaseNotesString);

        $('#product-info').text(`${productName}&trade; ${versionNumber} Release Notes`);
        $('.copyright').text(`Copyright &copy; 2018 ${creator}. All rights reserved.`);

        for (const item of resolvedIssuesItems) {
            $('#resolved-issues-list').append(`<li>${item}</li>\n`);
        }

        for (const item of enhancementsItems) {
            $('#enhancements-list').append(`<li>${item}</li>\n`);
        }

        for (const item of behavioralChangesItems) {
            $('#behavioral-changes-list').append(`<li>${item}</li>\n`);
        }
        
        resolve($.html());
    });
};

module.exports.writeReleaseNotes = async function (pathToReleaseNotes, text) {
    return new Promise(resolve => {
        const fs = require('fs');

        fs.writeFile(pathToReleaseNotes, text, (err) => {
            resolve();
        });
    });
};

module.exports.pushToRemote = async function (workingDirPath) {
    const simpleGit = require('simple-git')(workingDirPath);

    return new Promise(resolve => {
        simpleGit.add('*')
            .commit('updated release notes with help from whats-new')
            // TODO: push should be automated?
            // .push('origin', 'master')
            .exec(() => {
                resolve();
            });
    });
};