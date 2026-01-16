# Kubernetes Deployment Guide for EcoVista

## Prerequisites

1. **Enable Kubernetes in Docker Desktop**
   - Open Docker Desktop
   - Go to Settings → Kubernetes
   - Check "Enable Kubernetes"
   - Click "Apply & Restart"

2. **Verify Kubernetes is running**
   ```bash
   kubectl version
   kubectl cluster-info
   ```

## Phase 1: Deploy to Kubernetes

### Step 1: Build Docker Images

Build all images with proper tags:

```bash
# Build backend services
docker build -t ecovista-auth-service:latest ./backend/flask_app/auth-service
docker build -t ecovista-activity-service:latest ./backend/flask_app/activity-service
docker build -t ecovista-destination-service:latest ./backend/flask_app/destination-service
docker build -t ecovista-review-service:latest ./backend/flask_app/review-service
docker build -t ecovista-travelgroup-service:latest ./backend/flask_app/travelgroup-service
docker build -t ecovista-user-service:latest ./backend/flask_app/user-service

# Build frontend
docker build -t ecovista-frontend:latest ./frontend/frontend
```

### Step 2: Deploy to Kubernetes

Apply all manifests in order:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets and configmaps
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-configmap.yaml

# Create persistent volume claim
kubectl apply -f k8s/mysql-pvc.yaml

# Deploy MySQL
kubectl apply -f k8s/mysql-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql -n ecovista --timeout=120s

# Deploy backend services
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/activity-service.yaml
kubectl apply -f k8s/destination-service.yaml
kubectl apply -f k8s/review-service.yaml
kubectl apply -f k8s/travelgroup-service.yaml
kubectl apply -f k8s/user-service.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Optional: Deploy ingress (requires ingress controller)
kubectl apply -f k8s/ingress.yaml
```

### Step 3: Verify Deployment

```bash
# Check all pods
kubectl get pods -n ecovista

# Check services
kubectl get services -n ecovista

# Check deployments
kubectl get deployments -n ecovista

# View logs of a specific pod
kubectl logs -f <pod-name> -n ecovista
```

### Step 4: Access the Application

**Option 1: NodePort (Simple)**
```bash
# Frontend is exposed on NodePort 30000
# Access at: http://localhost:30000
```

**Option 2: Port Forward (Development)**
```bash
# Forward frontend
kubectl port-forward -n ecovista svc/frontend 3000:3000

# Forward backend services
kubectl port-forward -n ecovista svc/auth-service 5001:5001
kubectl port-forward -n ecovista svc/activity-service 5002:5002
kubectl port-forward -n ecovista svc/destination-service 5003:5003
kubectl port-forward -n ecovista svc/review-service 5004:5004
kubectl port-forward -n ecovista svc/travelgroup-service 5005:5005
kubectl port-forward -n ecovista svc/user-service 5006:5006
```

**Option 3: Ingress (Recommended)**
```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Add to /etc/hosts (or C:\Windows\System32\drivers\etc\hosts on Windows)
127.0.0.1 ecovista.local

# Access at: http://ecovista.local
```

## Phase 2: Kubernetes Features

### ConfigMaps (Already Implemented)
- MySQL schema is stored in ConfigMap
- View it: `kubectl get configmap mysql-schema -n ecovista -o yaml`

### Secrets (Already Implemented)
- Database password and SECRET_KEY are in Secrets
- View (base64 encoded): `kubectl get secret mysql-secret -n ecovista -o yaml`

### Readiness/Liveness Probes (Already Implemented)
- All services have health checks
- MySQL: `mysqladmin ping`
- Backend services: HTTP GET on their endpoints
- Check probe status: `kubectl describe pod <pod-name> -n ecovista`

### Scaling Services

Scale activity-service (already set to 2 replicas):
```bash
# Scale to 3 replicas
kubectl scale deployment activity-service --replicas=3 -n ecovista

# Verify
kubectl get pods -n ecovista -l app=activity-service

# Scale back to 2
kubectl scale deployment activity-service --replicas=2 -n ecovista
```

Scale any other service:
```bash
kubectl scale deployment <service-name> --replicas=<number> -n ecovista
```

## Troubleshooting

### View Pod Logs
```bash
kubectl logs <pod-name> -n ecovista
kubectl logs -f <pod-name> -n ecovista  # Follow logs
```

### Describe Pod (see events)
```bash
kubectl describe pod <pod-name> -n ecovista
```

### Get Pod Status
```bash
kubectl get pods -n ecovista -o wide
```

### Restart a Deployment
```bash
kubectl rollout restart deployment <deployment-name> -n ecovista
```

### Delete Everything
```bash
kubectl delete namespace ecovista
```

## Comparison: Docker Compose vs Kubernetes

| Feature | Docker Compose | Kubernetes |
|---------|---------------|------------|
| Orchestration | Single host | Multi-host cluster |
| Scaling | Manual | Automatic (HPA) |
| Health Checks | Basic | Advanced (readiness/liveness) |
| Secrets | .env files | Secrets API |
| Config | docker-compose.yml | Multiple YAML manifests |
| Networking | Bridge network | Service mesh |
| Storage | Volumes | PersistentVolumes |
| Load Balancing | None | Built-in |

## Next Steps

1. ✅ Deploy to local Kubernetes
2. ✅ Implement ConfigMaps and Secrets
3. ✅ Add health probes
4. ✅ Scale services
5. 🔄 Set up Horizontal Pod Autoscaler (HPA)
6. 🔄 Add resource limits and requests
7. 🔄 Implement monitoring (Prometheus/Grafana)
8. 🔄 Deploy to cloud (AWS EKS, GCP GKE, or Azure AKS)
