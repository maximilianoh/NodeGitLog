function removeUselessData(text){
    return text.replace(/(\r\n|\n|\r)/gm,"").trim();
}

async function parserData(path, parameter, funGetData){
    let resultCommand = {};
    let errorMessage = 'Something wrong, please check your configServerGit.json or if your project has at least one commit';
    try{ resultCommand = await funGetData(path, parameter);}
    catch(error) { return {'error':errorMessage}};
    if (!resultCommand.dataString || resultCommand.code === 128) return {'error':errorMessage};
    let valor = '' + resultCommand.dataString;
    let allCommitDetails = [];
    let allCommitList = [];
    let regexCommit = /(\ncommit|^commit)/gm;
    const intSum = "commit".length;
    let cleanTextCopy = valor;
    let listCommitsPosition = [];
    let temporalNext = cleanTextCopy.search(regexCommit);
    while (temporalNext!==-1){
        if (listCommitsPosition.length>0){
            let sum = listCommitsPosition[listCommitsPosition.length-1];
            listCommitsPosition.push(temporalNext+sum+intSum);
        }
        else listCommitsPosition.push(temporalNext);
        cleanTextCopy=cleanTextCopy.substring(temporalNext + intSum );
        temporalNext = cleanTextCopy.search(regexCommit);       
    }
    
    while (listCommitsPosition.length>0){
        if (listCommitsPosition.length>1){
            let string = valor.substring(listCommitsPosition[0],listCommitsPosition[1]);
            allCommitList.push(string);
            listCommitsPosition.shift();
        }
        else if (listCommitsPosition.length===1){
            allCommitList.push(valor.substring(listCommitsPosition[0]));
            listCommitsPosition.pop();
        }
    }
    allCommitList.map(commits=>{
        let temporalCommit = commits;
        let commit = temporalCommit.substring("commit ".length,temporalCommit.indexOf("\n"));
        commit = removeUselessData(commit);
        temporalCommit =temporalCommit.substring( temporalCommit.indexOf("Author"));
        let author = temporalCommit.substring("Author: ".length,temporalCommit.indexOf("\n"));
        temporalCommit =temporalCommit.substring( temporalCommit.indexOf("Date"));
        let date = temporalCommit.substring("Date:   ".length,temporalCommit.indexOf("\n"));
        temporalCommit = temporalCommit.substring( temporalCommit.indexOf("\n")+1);
        let message = temporalCommit.substring(0, temporalCommit.indexOf("\n\n")+2);
        message =  removeUselessData(message);
        temporalCommit = temporalCommit.substring( temporalCommit.indexOf("\n\n")+2);
        let filesGit =  temporalCommit.replace(/(\r\n|\n|\r)/gm,",");
        
        let files = filesGit.split(",");
        files = files.filter( file => {if (file) return true;});
        
        
        let object = { commit, author, date, message, files} 
        allCommitDetails.push(object);
    });
    return allCommitDetails;
};

module.exports = {
    parserData
}