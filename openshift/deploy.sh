#!/bin/bash

# EcoVista OpenShift Deployment Script

echo "=== EcoVista OpenShift Deployment ==="
echo ""

# Step 1: Login
echo "Step 1: Login to OpenShift"
oc login https://api.na46r.prod.ole.redhat.com:6443 -u mrohun -p 2a4ae2d02d5640c18e04

# Step 2: Create project
echo ""
echo "Step 2: Creating project 'ecovista'"
oc new-project ecovista || oc project ecovista

# Step 3: Create BuildConfigs and ImageStreams
echo ""
echo "Step 3: Creating BuildConfigs and ImageStreams"
oc apply -f openshift/buildconfigs.yaml

# Step 4: Build images
echo ""
echo "Step 4: Building images (this may take a while...)"
echo "Building auth-service..."
oc start-build auth-service --from-dir=./backend/flask_app/auth-service --follow

echo "Building activity-service..."
oc start-build activity-service --from-dir=./backend/flask_app/activity-service --follow

echo "Building destination-service..."
oc start-build destination-service --from-dir=./backend/flask_app/destination-service --follow

echo "Building review-service..."
oc start-build review-service --from-dir=./backend/flask_app/review-service --follow

echo "Building travelgroup-service..."
oc start-build travelgroup-service --from-dir=./backend/flask_app/travelgroup-service --follow

echo "Building user-service..."
oc start-build user-service --from-dir=./backend/flask_app/user-service --follow

echo "Building frontend..."
oc start-build frontend --from-dir=./frontend/frontend --follow

# Step 5: Create secrets and configmaps
echo ""
echo "Step 5: Creating secrets and configmaps"
oc apply -f openshift/secrets.yaml
oc apply -f openshift/mysql-configmap.yaml

# Step 6: Deploy MySQL
echo ""
echo "Step 6: Deploying MySQL"
oc apply -f openshift/mysql-deployment.yaml

echo "Waiting for MySQL to be ready..."
oc wait --for=condition=ready pod -l app=mysql --timeout=120s

# Step 7: Deploy backend services
echo ""
echo "Step 7: Deploying backend services"
oc apply -f openshift/auth-service.yaml
oc apply -f openshift/backend-services.yaml

# Step 8: Deploy frontend
echo ""
echo "Step 8: Deploying frontend"
oc apply -f openshift/frontend.yaml

# Step 9: Create routes
echo ""
echo "Step 9: Creating routes"
oc apply -f openshift/routes.yaml

# Step 10: Show status
echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Checking status..."
oc get pods
echo ""
echo "Routes:"
oc get routes
echo ""
echo "Frontend URL:"
oc get route frontend -o jsonpath='{.spec.host}'
echo ""
echo ""
echo "Access your application at the frontend URL above!"
