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
rm -rf /app/site/output
rm -rf /app/site/data
rm -rf /app/site/config
rm -rf /app/site/sourcecred.json
cp -rf /app/output /app/site/
cp -rf /app/data /app/site/
cp -rf /app/config /app/site/
cp -rf /app/sourcecred.json /app/site/
cp -rf /app/package.json /app/site/
cp -rf /app/yarn.lock /app/site/
cp -rf /app/site/* ./ 

git config --global user.email "arabot-1@aragon.org"
git config --global user.name "Arabot-1"
git commit -am "Update sourcecred"
git push