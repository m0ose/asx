## AgentScript Modules Repository

This is a repository for the future version of [AgentScript](http://agentscript.org), an es6 module based project.

To clone a fresh repo, for PRs or your own local verson:
* cd to where you want thd asx/ dir to appear.
* git clone https://github.com/backspaces/asx # create skeleton repo
* cd asx # go to new repo
* npm install # install all dev dependencies.
* npm run all # Create all derived files
* open http://<path to asx>/test.html and check console for messages

Note the repo has no "derived" files, i.e. won't run by just cloning and running the test.html file. Thus the `npm run all` which mainly compiles modules (babel) for use by System.js.
