@echo off
echo === EcoVista OpenShift Deployment (Windows) ===
echo.

echo Step 1: Login to OpenShift
oc login https://api.na46r.prod.ole.redhat.com:6443 -u RHT_OCP4_DEV_USERmrohun -p RHT_OCP4_DEV_PASSWORD2a4ae2d02d5640c18e04

echo.
echo Step 2: Creating project 'ecovista'
oc new-project ecovista || oc project ecovista

echo.
echo Step 3: Creating secrets and configmaps
oc apply -f openshift/secrets.yaml
oc apply -f openshift/mysql-configmap.yaml

echo.
echo Step 4: Deploying MySQL
oc apply -f openshift/mysql-deployment.yaml

echo Waiting for MySQL to be ready...
oc wait --for=condition=ready pod -l app=mysql --timeout=120s

echo.
echo === IMPORTANT ===
echo Due to Windows file permission issues with binary uploads,
echo you need to use one of these alternatives:
echo.
echo Option 1: Use the Web Console (Recommended)
echo   1. Go to: https://console-openshift-console.apps.na46r.prod.ole.redhat.com
echo   2. Follow the guide in openshift/web-console-guide.md
echo.
echo Option 2: Push to GitHub and use Git builds
echo   1. Push your code to GitHub
echo   2. Update openshift/buildconfigs-git.yaml with your repo URL
echo   3. Run: oc apply -f openshift/buildconfigs-git.yaml
echo   4. Run: oc start-build auth-service
echo.
echo Option 3: Use WSL (Windows Subsystem for Linux)
echo   1. Install WSL
echo   2. Run the deployment from WSL environment
echo.
echo MySQL is deployed and ready. Choose one of the options above to deploy your services.

pause