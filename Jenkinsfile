pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'samg1988'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'
        KUBECONFIG = '/root/.kube/config'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}",
                                                 usernameVariable: 'USERNAME',
                                                 passwordVariable: 'PASSWORD')]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Build & Push Images') {
            steps {
                sh '''
                docker build -t ${DOCKER_HUB_USER}/ecommerce-frontend:latest ./frontend
                docker push ${DOCKER_HUB_USER}/ecommerce-frontend:latest

                docker build -t ${DOCKER_HUB_USER}/ecommerce-product:latest ./product-service
                docker push ${DOCKER_HUB_USER}/ecommerce-product:latest

                docker build -t ${DOCKER_HUB_USER}/ecommerce-order:latest ./order-service
                docker push ${DOCKER_HUB_USER}/ecommerce-order:latest

                docker build -t ${DOCKER_HUB_USER}/ecommerce-inventory:latest ./inventory-service
                docker push ${DOCKER_HUB_USER}/ecommerce-inventory:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    try {
                        // Apply manifests
                        sh '''
                        kubectl apply -f k8s/mysql.yaml
                        kubectl apply -f k8s/frontend.yaml
                        kubectl apply -f k8s/product.yaml
                        kubectl apply -f k8s/order.yaml
                        kubectl apply -f k8s/inventory.yaml
                        '''

                        // Rollout checks with timeout
                        timeout(time: 2, unit: 'MINUTES') {
                            sh 'kubectl rollout status deployment/frontend-deployment --timeout=60s'
                            sh 'kubectl rollout status deployment/product-deployment --timeout=60s'
                            sh 'kubectl rollout status deployment/order-deployment --timeout=60s'
                            sh 'kubectl rollout status deployment/inventory-deployment --timeout=60s'
                            sh 'kubectl rollout status deployment/mysql --timeout=60s'
                        }
                    } catch (Exception e) {
                        echo "❌ Deployment failed, rolling back..."
                        sh '''
                        kubectl rollout undo deployment/frontend-deployment || true
                        kubectl rollout undo deployment/product-deployment || true
                        kubectl rollout undo deployment/order-deployment || true
                        kubectl rollout undo deployment/inventory-deployment || true
                        kubectl rollout undo deployment/mysql || true
                        '''
                        error("Deployment failed and rollback executed.")
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}