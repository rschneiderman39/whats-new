module.exports.getShouldClearReleaseNotes = async function (rl) {
    return new Promise(resolve => {
        rl.question('Would you like to clear current content from release-notes? ', (answer) => {
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
}