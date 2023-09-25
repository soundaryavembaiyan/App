import os
import subprocess
import boto3
import argparse


parser = argparse.ArgumentParser(description='Provide environment name.')
parser.add_argument('env', type=str, help='Environment name')
args = parser.parse_args()


print('### Install NodeModules ###')
os.system("npm install")
print('### building the angular project ###')
os.system("ng build")

# print('moving all html files to destination folder')
# os.system('mv *.html dist/profui')


KEY = os.environ['S3_BUILD_KEY']
SECRET = os.environ['S3_BUILD_SECRET']
BUCKET = os.environ['S3_BUILD_BUCKET']

output = subprocess.check_output(['git', 'tag'])
tags = output.decode().split("\n")
latest = tags[-2]
print("### working on tag ... {} ####".format(latest))
# Make the archive file using the system commands
os.chdir("dist/")
print("pwd is")
print(os.system("pwd")  )
build_file = "lauditorv3-{}.tar.gz".format(latest)
os.system("tar -cvf {} client-app".format(build_file))
print("#### uploading ...######")
client = boto3.client("s3", config= boto3.session.Config(signature_version='s3v4'),
                            aws_access_key_id=KEY,
                            region_name="us-east-1",
                            aws_secret_access_key=SECRET)
client.upload_file(build_file, BUCKET, build_file)
print("####### removing archive #######")
os.system("rm {}".format(build_file))
os.chdir("/var/lib/jenkins/workspace/Dev1Jobs/LauditorV3")
print(os.system("pwd"))
print("####### deplying in dev #########")
os.system("ansible-playbook devdeploy.yaml --extra-vars 'tag={} env={}'".format(latest, args.env))
