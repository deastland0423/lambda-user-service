#!/bin/sh
set -e  # halt on error
set -x  # show commands
cp dev/config/aws/* ~/.aws/ # refresh aws config/credentials
npm install # install dependencies
nodemon dev/localdev.js  #startup nodemon
