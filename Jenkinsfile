pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "bills-app"
    DOCKER_TAG = "latest"
    COMPOSE_FILE = "docker-compose.yml"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      when {
        expression { return false }
      }
      steps {
        echo 'Lint step skipped.'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        sh "docker-compose -f $COMPOSE_FILE up -d --build"
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
    success {
      echo 'Build and deploy succeeded!'
    }
    failure {
      echo 'Build or deploy failed.'
    }
  }
}
