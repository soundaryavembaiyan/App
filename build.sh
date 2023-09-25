#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=development
cd dist
tar -cvf lauditorv3-0.1.tar.gz client-app
aws s3 cp lauditorv3-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook devdeploy.yml --extra-vars 'tag=0.1 env=dev2'