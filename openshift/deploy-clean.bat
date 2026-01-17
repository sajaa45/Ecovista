@echo off
echo Deploying EcoVista to OpenShift...

echo 1. Building images from Git...
oc apply -f buildconfigs-git.yaml
oc start-build auth-service
oc start-build activity-service  
oc start-build frontend

echo 2. Waiting for builds to complete...
timeout /t 60

echo 3. Deploying application...
oc apply -f complete-deployment.yaml

echo 4. Checking status...
oc get pods
oc get routes

echo Deployment complete! Check the routes above for your application URLs.