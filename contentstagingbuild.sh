#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=contentstaging
cd dist
tar -cvf content-staging-0.1.tar.gz client-app
aws s3 cp content-staging-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook contentstagingdeploy.yml --extra-vars 'tag=0.1 env=staging'