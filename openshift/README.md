# OpenShift Deployment Guide for EcoVista

## Prerequisites

1. **OpenShift CLI (oc)**
   - Download from: https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/
   - Or use the web terminal in OpenShift Console

2. **Your Credentials**
   - Username: `RHT_OCP4_DEV_USERmrohun`
   - Password: `RHT_OCP4_DEV_PASSWORD2a4ae2d02d5640c18e04`
   - API Endpoint: `https://api.na46r.prod.ole.redhat.com:6443/`
   - Console: `https://console-openshift-console.apps.na46r.prod.ole.redhat.com`

## Quick Start

### Step 1: Login to OpenShift

```bash
# Login via CLI
oc login https://api.na46r.prod.ole.redhat.com:6443 -u RHT_OCP4_DEV_USERmrohun -p RHT_OCP4_DEV_PASSWORD2a4ae2d02d5640c18e04

# Or get login command from web console:
# 1. Go to https://console-openshift-console.apps.na46r.prod.ole.redhat.com
# 2. Click your username (top right) → "Copy login command"
# 3. Paste in terminal
```

### Step 2: Create Project (Namespace)

```bash
# Create a new project
oc new-project ecovista

# Or use existing project
oc project ecovista
```

### Step 3: Build and Push Images to OpenShift Registry

OpenShift has a built-in container registry. We'll use BuildConfigs:

```bash
# Create BuildConfigs for all services
oc apply -f openshift/buildconfigs.yaml

# Start builds
oc start-build auth-service --from-dir=./backend/flask_app/auth-service --follow
oc start-build activity-service --from-dir=./backend/flask_app/activity-service --follow
oc start-build destination-service --from-dir=./backend/flask_app/destination-service --follow
oc start-build review-service --from-dir=./backend/flask_app/review-service --follow
oc start-build travelgroup-service --from-dir=./backend/flask_app/travelgroup-service --follow
oc start-build user-service --from-dir=./backend/flask_app/user-service --follow
oc start-build frontend --from-dir=./frontend/frontend --follow
```

### Step 4: Deploy Application

```bash
# Create secrets
oc apply -f openshift/secrets.yaml

# Create ConfigMaps
oc apply -f openshift/mysql-configmap.yaml

# Deploy MySQL with persistent storage
oc apply -f openshift/mysql-deployment.yaml

# Wait for MySQL to be ready
oc wait --for=condition=ready pod -l app=mysql --timeout=120s

# Deploy backend services
oc apply -f openshift/auth-service.yaml
oc apply -f openshift/activity-service.yaml
oc apply -f openshift/destination-service.yaml
oc apply -f openshift/review-service.yaml
oc apply -f openshift/travelgroup-service.yaml
oc apply -f openshift/user-service.yaml

# Deploy frontend
oc apply -f openshift/frontend.yaml

# Create routes (OpenShift's ingress)
oc apply -f openshift/routes.yaml
```

### Step 5: Access Application

```bash
# Get the frontend route URL
oc get route frontend -o jsonpath='{.spec.host}'

# Example output: frontend-ecovista.apps.na46r.prod.ole.redhat.com
# Access at: https://frontend-ecovista.apps.na46r.prod.ole.redhat.com
```

## Monitoring

### View Pods
```bash
oc get pods
oc get pods -w  # Watch mode
```

### View Logs
```bash
oc logs -f <pod-name>
oc logs -f deployment/auth-service
```

### View Routes
```bash
oc get routes
```

### View Services
```bash
oc get svc
```

### Describe Resources
```bash
oc describe pod <pod-name>
oc describe deployment <deployment-name>
```

## Scaling

```bash
# Scale activity-service to 3 replicas
oc scale deployment activity-service --replicas=3

# Verify
oc get pods -l app=activity-service
```

## Troubleshooting

### Check Build Status
```bash
oc get builds
oc logs -f build/<build-name>
```

### Check Events
```bash
oc get events --sort-by='.lastTimestamp'
```

### Restart Deployment
```bash
oc rollout restart deployment/<deployment-name>
```

### Delete Everything
```bash
oc delete project ecovista
```

## OpenShift vs Kubernetes Differences

| Feature | Kubernetes | OpenShift |
|---------|-----------|-----------|
| CLI | kubectl | oc |
| Namespace | namespace | project |
| Ingress | Ingress | Route |
| Registry | External | Built-in |
| Security | Basic RBAC | Enhanced SCC |
| Build | External | BuildConfig |
| UI | Basic | Advanced Developer Console |

## Web Console Usage

1. **Login**: https://console-openshift-console.apps.na46r.prod.ole.redhat.com
2. **Switch to Developer perspective** (top left dropdown)
3. **Select your project**: ecovista
4. **View Topology**: See all your services visually
5. **Monitor**: Check logs, metrics, and events
6. **Routes**: Click on route icons to access services

## CI/CD with OpenShift Pipelines (Optional)

OpenShift includes Tekton for CI/CD:

```bash
# Install OpenShift Pipelines Operator (if not installed)
# This is done via the web console: Operators → OperatorHub → OpenShift Pipelines

# Create pipeline
oc apply -f openshift/pipeline.yaml

# Run pipeline
oc create -f openshift/pipelinerun.yaml
```

## Next Steps

1. ✅ Deploy to OpenShift
2. ✅ Use built-in registry
3. ✅ Create Routes for external access
4. 🔄 Set up CI/CD with Tekton
5. 🔄 Configure autoscaling (HPA)
6. 🔄 Add monitoring with Prometheus
7. 🔄 Implement GitOps with ArgoCD
