#!/bin/bash
python ./hyde/hyde.py -g -s development -d deploy
# Run the deployment, generating the required path deployment.
python ./env/Scripts/activate_this.py