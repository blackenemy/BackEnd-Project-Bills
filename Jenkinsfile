pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "bills-app"
    DOCKER_TAG = "latest"
    COMPOSE_FILE = "docker-compose.yml"
    // URL used by the OpenAPI /reference UI. Can be overridden via Jenkins credentials if needed.
    API_URL = 'https://apiv2.detectivedocs.xyz'
    // If you prefer to store this in Jenkins Credentials, replace the line above with:
    // API_URL = credentials('jenkins-api-url-credential-id')
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


    stage('Build Docker Image') {
      steps {
        sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
      }
    }

    stage('Remove Postgres Volume') {
      steps {
        sh 'docker-compose down'
        sh 'docker volume rm project-bill-backend_postgres_data || true'
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
