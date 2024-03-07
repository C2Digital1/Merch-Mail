## Package.json

This file contains all information about Node.js project and all external dependencies it uses all in JSON format.

### Scripts

These scripts are normally used to bundle(combine) large scripts so they can be typed easily by running `npm run <script name>`.
There are a few scripts already added like `"dev": "shopify theme dev"`  which can be run using `npm run dev`.If you prefer you can run these scripts directly as well by using  `shopify theme dev` and it will work the same.

### Dependencies
These are list of Javascript packages/libraries being used in project with their versions. So we have a record of all libaries used.Additionally these packages are stored in `node_modules` folder. We can download these packages from https://www.npmjs.com/. A few examples for these packages can be Jquery, React etc. All these  packages are public and can be installed by running `npm install <package name>`


## Private Packages 
Same as public packages, we can use private packages as well.These packages are can only be used inside an organization like github and require github access token to install. In this way we can create C2's internal packages for utilities and such. If anyone would like to create a package feel free to create it and update this read me with install instructions for others.


### Instructions to install private packages


1 => Make sure you have `.npmrc` file in your project root directory if not you can pull c2-theme main branch for latest files(which include .npmrc file)

2 => In CMD/Terminal type  `npm  install <package name>` to install the private package. Make sure it starts with org name `@c2digital1`


## List of Private Packages Available

-  [C2](https://github.com/C2Digital1/cli/pkgs/npm/c2)




