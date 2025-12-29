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
        git branch: 'main',
            url: 'https://github.com/poweruser2025/mern-task-manager-devops.git'
    }
}


        stage('Configure AWS + Login ECR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-jenkins',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh '''
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set default.region $AWS_REGION

                    aws sts get-caller-identity

                    aws ecr get-login-password --region $AWS_REGION \
                      | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh '''
                    docker build -t task-frontend:v1 .
                    docker tag task-frontend:v1 $ECR_FRONT:v1
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh '''
                    docker build -t task-backend:v1 .
                    docker tag task-backend:v1 $ECR_BACK:v1
                    '''
                }
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
