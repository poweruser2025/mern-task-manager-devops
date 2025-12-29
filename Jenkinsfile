pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-2"
        ACCOUNT_ID = "879519940612"
        ECR_FRONT = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/task-manager-frontend"
        ECR_BACK = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/task-manager-backend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/poweruser2025/mern-task-manager-devops.git'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                cd frontend
                docker build -t task-frontend:v1 .
                docker tag task-frontend:v1 $ECR_FRONT:v1
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                cd backend
                docker build -t task-backend:v1 .
                docker tag task-backend:v1 $ECR_BACK:v1
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $ECR_FRONT:v1
                docker push $ECR_BACK:v1
                '''
            }
        }
    }
}
