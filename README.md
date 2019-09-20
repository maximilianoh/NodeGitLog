# NodeGitLog
Nodejs server API that show git log from one folder

## Download project
    git clone https://github.com/maximilianoh/NodeGitLog.git
    yarn install
    yarn start

## Config 
    In configServerGit.json
```json
      {
        "path": "path/local/repository/.git",
        "notCheckUpdate": true, 
        "branch": "master" 
      }
```
    notCheckUpdate = true if it do git pull in all petitions, 
                    false you can update manually with url: /updateRepository
    branch do git pull origin "branch"

    In index.js
      You can change the port


## Example
      git clone https://github.com/octocat/Spoon-Knife.git in /home/user/example/

      set /home/user/example/Spoon-Knife/.git in  configServerGit.json
  
  
    Show commits (GET)
    http://localhost:3001/updateRepository
```json
        {"cantHistorys":""} or {}
        {"cantHistorys":"5"} or {"cantHistorys":5}
```


    Show commits (POST)
    http://localhost:3001/commits
```json
        {"cantHistorys":""} or {}
        {"cantHistorys":"5"} or {"cantHistorys":5}
```

    Show commits by file (POST)
    http://localhost:3001/commitsFile
```json
        {"cantHistorys":"", "file":""} or {}
        {"cantHistorys":"", "file":"readme"} 
```
      check if readme has changed in last "cantHistorys" commits

    Show commits by author (POST)
    http://localhost:3001/commitsAuthor
```json
     {"cantHistorys":"", "author":""} or {}
     {"cantHistorys":"1", "author":"oct"} 
```
      check if "author" has commited in last "cantHistorys" commits



## Format Return
    200:
```json
    [
      {
        "commit": "f439fc5710cd87a4025247e8f75901cdadf5333d",
        "author": "The Octocat <octocat@nowhere.com>",
        "date": "Wed Sep 3 14:22:02 2014 -0700",
        "message": "Update README.md",
        "files": [
          "README.md"
        ]
      }
    ]
```

    404:
```json
     {
       "error": "Something wrong, please check your configServerGit.json or if your project has at least one commit"
     }
```
