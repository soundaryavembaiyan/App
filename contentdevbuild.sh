#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=contentdev
cd dist
tar -cvf contentv3-0.1.tar.gz client-app
aws s3 cp contentv3-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook contentdevdeploy.yml --extra-vars 'tag=0.1 env=dev2'