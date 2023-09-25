#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=connectdev
cd dist
tar -cvf connectv3-0.1.tar.gz client-app
aws s3 cp connectv3-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook connectdevdeploy.yml --extra-vars 'tag=0.1 env=dev2'