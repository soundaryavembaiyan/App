#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=connectstaging
cd dist
tar -cvf connect-staging-0.1.tar.gz client-app
aws s3 cp connect-staging-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook connectstagingdeploy.yml --extra-vars 'tag=0.1 env=staging'