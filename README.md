## Requirements 
#### (These are for windows only. For Mac visit https://shopify.dev/docs/themes/tools/cli/install#requirements)
1): Install Nodejs from this link https://nodejs.org/en/download

2): Install Ruby from this link https://rubyinstaller.org/downloads/ (select MSYS2 while installing ruby)

3): Install git from this link https://git-scm.com/downloads

4): Install bundler by opening CMD/Terminal with admin access and typing `gem install bundler`

## Install Shopify CLI 

1): Open CMD/Terminal again and type `npm install -g @shopify/cli @shopify/theme` to install Shopify and Shopify Theme CLI 

## Setup Github
1): Open CMD/Terminal in the folder where you would like to start the theme project 

2): Clone this repo https://github.com/C2Digital1/c2-theme using command `git clone https://github.com/C2Digital1/c2-theme` 

3): Git might ask you to login into your account, Use your c2 account for this 

4): Type `git config --global user.email "YOUR_EMAIL"` to add your email for git.(replace YOUR_EMAIL with your c2 email used when creating github account)

5): Type `git config --global user.name "YOUR_NAME"` to add your username for git.(replace YOUR_NAME with your github username)

6): Type `cd c2-theme` to move into project directory created by git clone command.

7): Create a new branch using `git branch [Your Name here]-dev`

8): Checkout into your branch by typing `git checkout [Your branch name]`

9): Add a remote origin to c2-theme repo by typing `git remote add c2 https://github.com/C2Digital1/c2-theme.git`

10): Add `git checkout [Your branch name]` to make sure you are in right branch for future changes.



## Start Project

1): In your project directory open CMD/Terminal and type command `npm install` to install dependencies 

2): Run `shopify theme dev --store="Store myshopify.com link here"` in CMD/Terminal to create a new preview theme and preview it locally

**NOTE** The store flag here is needed for first time so shopify CLI knows what store to work with. You can check store name with `shopify theme info` command. After setting up a new project this command can also be used as `shopify theme dev`(without store flag) or `npm run dev`. The second one is defined under scripts in package.json file and more commands can be added here as well including commands to install private packages(libraries) to run them directly with  npm run prefix in terminal. Visit this [guide](https://github.com/C2Digital1/c2-theme/blob/main/Shopify-CLI.md) for more info on package.json scripts and how to use them for private packages.

## Push changes

1): After making changes to this theme, follow below commands to push them to github

`git checkout [Your branch name]` to make sure you are in right branch

`git add <file-name> <file-name>` to stage the files that were changed e.g if `index__product.liquid` was changed you can write `git add sections/index__product.liquid`
(NOTE: Use `git status` to see the files that were changes)

`git commit -m "Commit Name here(can be feature name)"` Add a commit 

`git push c2 [Your branch name]` Push this new commit to Github repo.


2): Step 1 will update your branch with latest code, All that is left is to create a Pull Request to Main branch by going to https://github.com/C2Digital1/c2-theme and opening your branch and clicking `Contribute > Open Pull Request` on top right corner of code tab. This can also be done with git commands.


## Keep your local theme up-to-date with Main branch for future changes

1): When starting a new feature or fixing a bug, make sure your theme is up-to-date with Main branch first

2): You can do it by using git's pull command, Below are the instructions

3): First make sure you do not have any staged changes by using command `git stash` to delete all staged changes

4): Than type `git pull c2 main` to pull everything from main branch. The `c2` here refers to the repo origin main so make sure to change it in case you used a different name.

5): Resolve any conflicts(if any) and now you can go  ahead with making your new changes.

6): After all changes are done, You can follow **PUSH CHANGES** instructions to push the new changes again to your remote branch.
