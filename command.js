const { spawn } = require('child_process');
const fs = require('fs');
var util = require('./util');
let errorMessage = 'Something wrong, git can not pull. Please check your path and branch in configServerGit.json';

async function readFileJson(pathName){
    return new Promise( (resolve, reject) => {
        fs.readFile(pathName, 'utf-8', function (err, data){
            if(err) reject(err);
            try{ resolve (JSON.parse(data))} 
             catch(error){reject (error)}
        })
    }

    )
}

const execWithPromiseGitPull = async (path, branch="master") => {
    return new Promise(async (resolve, reject) => {
        const process = spawn('git',  ['-C',path, 'origin', branch]);
        process.stdout.on('data', data => resolve(data));
        process.stderr.on('error', err => reject(err));
        process.on('close', (code) => resolve({code}));
    });
};

async function updatePullGit(){
    let parameters = await readFileJson("./configServerGit.json");
    let result = await (execWithPromiseGitPull(parameters.path, parameters.branch));
    if (result.code === 128){ return {'error':errorMessage}}
    return '';
}

const execWithPromiseGitLog = async (path, cantHistory) => {
    return new Promise(async (resolve, reject) => {
        let dataString = '';
        if (!cantHistory) cantHistory = ''; // do not do anything, because is already defined.
        let listPrameters = ['--no-pager', '-C',path, 'log', '-m', '--name-only', '--all', cantHistory];
        listPrameters = listPrameters.filter( param => {if (param) return true;})
        const process = spawn('git',  listPrameters);
        process.stdout.on('data', data => dataString+=''+data);
        process.stderr.on('error', err => reject(err));
        process.on('close', (code) => resolve({dataString, code}));
    });
};

async function createData(long =""){
    let parameters = await readFileJson("./configServerGit.json");
    if(!parameters.notCheckUpdate){
        let result = await (execWithPromiseGitPull(parameters.path, parameters.branch));
        if (result.code === 128) return {'error':errorMessage};
    }
    let paramHistory = '';
    if (long) paramHistory = long;
    if (!isNaN(paramHistory) && paramHistory) paramHistory = '-' + paramHistory;
    else paramHistory = '';
    let data = await util.parserData(parameters.path, paramHistory, execWithPromiseGitLog);
    if(paramHistory){
        let count = paramHistory.replace("-","");
        if (data.length>count){
            let filterData = data.filter( (commit, index) => {
                if (index < count) return true
            });
            return filterData;
        }
    }
    return data;
}

module.exports = {
    createData, updatePullGit
}