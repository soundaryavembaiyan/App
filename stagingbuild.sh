cd lauditor
npm install --force
ng build --configuration=staging  
cd dist
tar -cvf lauditor-staging-0.1.tar.gz client-app
aws s3 cp lauditor-staging-0.1.tar.gz s3://cyberitus-builds/
cd ../../
ansible-playbook stagingdeploy.yml --extra-vars 'tag=0.1 env=staging'