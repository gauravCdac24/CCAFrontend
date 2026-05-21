pipeline {
    agent any

     environment {
        NODEJS_HOME = tool 'nodejs'
    }

    stages {
        stage('Build') {
            steps { 
                    
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install -f'
                
            }
        }
        
        stage('Deploy') {
            steps {
               
                    sh 'npm start'
               
            }
        }

    }
}

post {
    
        success {
            echo 'CCA Front End application deployed and running successfully!'
        }
        
        failure {
            echo 'CCA FRONT END: Pipeline failed!'
        }
    }
	

