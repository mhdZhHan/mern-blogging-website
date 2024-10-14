#!/bin/bash

#=================================================================================
# User Input Section
#=================================================================================
echo "Enter the domain name (e.g., demo.mohammedsh.xyz):"
read DOMAIN_NAME

#=================================================================================
# Update System and Install Dependencies
#=================================================================================
echo "Updating system and installing dependencies..."
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx curl software-properties-common
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js (using NodeSource PPA)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 to manage the Node.js app
echo "Installing PM2..."
sudo npm install pm2 -g

#=================================================================================
# .env File Handling
#=================================================================================
# Check if .env file exists in the root directory
if [ -f ".env" ]; then
  echo ".env file already exists."
  # Extract the PORT value from the .env file
  PORT=$(grep PORT .env | cut -d '=' -f2 | tr -d '"')
  # If the PORT variable is empty or not found in .env, prompt for input
  if [ -z "$PORT" ]; then
    echo "PORT not found in .env file."
    read -p "Enter the Port (PORT): " PORT
  fi
else
  echo ".env file not found. Creating a new .env file."

  # Prompt for user input to generate .env file
  echo "Please provide the following details:"
  read -p "Enter MongoDB Location (DB_LOCATION): " DB_LOCATION
  read -p "Enter Secret Access Key (SECRET_ACCESS_KEY): " SECRET_ACCESS_KEY
  read -p "Enter AWS Access Key (AWS_ACCESS_KEY): " AWS_ACCESS_KEY
  read -p "Enter AWS Secret Access Key (AWS_SECRET_ACCESS_KEY): " AWS_SECRET_ACCESS_KEY
  read -p "Enter Node Environment (NODE_ENV) [production/development]: " NODE_ENV
  read -p "Enter the Port (PORT): " PORT

  # Write the environment variables to the .env file
  echo "DB_LOCATION=\"$DB_LOCATION\"" > .env
  echo "SECRET_ACCESS_KEY=\"$SECRET_ACCESS_KEY\"" >> .env
  echo "AWS_ACCESS_KEY=\"$AWS_ACCESS_KEY\"" >> .env
  echo "AWS_SECRET_ACCESS_KEY=\"$AWS_SECRET_ACCESS_KEY\"" >> .env
  echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=\"1\"" >> .env
  echo "NODE_ENV=\"$NODE_ENV\"" >> .env
  echo "PORT=\"$PORT\"" >> .env

  echo ".env file created successfully."
fi

#=================================================================================
# Install Dependencies and Build the App
#=================================================================================
echo "Installing backend and frontend dependencies, and building the frontend..."
npm run build

# Start the app with PM2 dynamically using the repo name
REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)")
echo "Starting the app with PM2 using process name $REPO_NAME..."
pm2 start npm --name "$REPO_NAME" -- run start

#=================================================================================
# Nginx Configuration
#=================================================================================
echo "Setting up Nginx for domain $DOMAIN_NAME..."
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

#=================================================================================
# Set Up SSL Using Certbot
#=================================================================================
echo "Setting up SSL with Certbot for domain $DOMAIN_NAME..."
sudo certbot --nginx -d $DOMAIN_NAME

# Configure firewall to allow traffic
echo "Configuring firewall..."
sudo apt install ufw -y
sudo ufw allow 'Nginx Full'
sudo ufw enable

echo "Deployment completed successfully for domain: $DOMAIN_NAME"
#=================================================================================
