var command = require('./command.js');


async function getPull(){
    return await command.updatePullGit();
}

async function getCommit(cant = "all" ){
    return await command.createData(cant);
}

async function getCommitByFiles(file = "", cant = ""){
    let getData = '';
    if (cant) getData = await getCommit(cant);
    else getData = await getCommit();
    if (getData.error) return getData;
    
    let listFilter = getData.filter(commit => {
        let condition = false;
        commit.files.map(fileString =>{
            if (fileString.toLowerCase().includes(file.toLowerCase())) condition = true;
        });
        if (condition) return commit;
    });
    return listFilter;
}

async function getCommitByAuthor(author = "", cant = ""){
    let getData = '';
    if (cant) getData = await getCommit(cant);
    else getData = await getCommit();
    if (getData.error) return getData;
    let listFilter = getData.filter(commit => {
        if (commit.author.toLowerCase().includes(author.toLowerCase())) return commit;
    });
    return listFilter;
}



module.exports = {
    getCommit,
    getCommitByAuthor,
    getCommitByFiles,
    getPull
}