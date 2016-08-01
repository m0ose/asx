## AgentScript Modules Repository

This is a repository for the future version of [AgentScript](http://agentscript.org), an es6 module based project.

To clone a fresh repo, for PRs or your own local verson:
* cd to where you want the asx/ dir to appear.
* git clone https://github.com/backspaces/asx # create skeleton repo
* cd asx # go to new repo
* npm install # install all dev dependencies.
* npm run all # Create all derived files
* open `http://<path to asx>/test.html` and check console for messages

All workflow is npm run scripts.  See package.json's scripts, or simply run `npm run` for a list.

The repo has no "derived" files, i.e. won't run by just cloning. To complete the repo, use `npm run all` which mainly compiles modules (babel) for use by System.js.
