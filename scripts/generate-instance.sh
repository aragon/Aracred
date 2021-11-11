#!/bin/bash
cd /app
yarn sourcecred go
yarn sourcecred analysis
yarn sourcecred site

TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR
git clone "https://arabot-1:$SOURCECRED_GITHUB_TOKEN@github.com/aragon/Aracred.git"
cd Aracred
git checkout gh-pages
rm -rf /app/site/{output,data,config,sourcecred.json}
cp -r /app/{output,data,config,sourcecred.json,package.json,yarn.lock} /app/site/
cp -r /app/site/* ./ 

git config --global user.email "arabot-1@aragon.org"
git config --global user.name "Arabot-1"
git commit -am "Update sourcecred"
git push