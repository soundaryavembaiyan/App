#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=corporatestaging
cd dist
tar -cvf corporate-staging-0.1.tar.gz client-app
aws s3 cp corporate-staging-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook corporatestagingdeploy.yml --extra-vars 'tag=0.1 env=staging'