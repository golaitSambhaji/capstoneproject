pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'samg1988'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds' // Jenkins credentials ID
        KUBECONFIG = '/root/.kube/config'  // Path to kubeconfig on Jenkins agent
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
                sh '''
                kubectl apply -f k8s/frontend.yaml
                kubectl apply -f k8s/product.yaml
                kubectl apply -f k8s/order.yaml
                kubectl apply -f k8s/inventory.yaml

                kubectl rollout status deployment/frontend-deployment
                kubectl rollout status deployment/product-deployment
                kubectl rollout status deployment/order-deployment
                kubectl rollout status deployment/inventory-deployment
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}