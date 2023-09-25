#!/bin/bash
cd lauditor
npm install --force
ng build --configuration=corporatedev
cd dist
tar -cvf corporatev3-0.1.tar.gz client-app
aws s3 cp corporatev3-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook corporatedevdeploy.yml --extra-vars 'tag=0.1 env=dev2'