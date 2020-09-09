# Dockerfile adapted from https://mherman.org/blog/dockerizing-a-react-app/
FROM node:13.12.0-alpine

WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install -g npm
RUN npm install && npm audit fix

# Copies everything over to Docker environment
COPY . .

# Uses port which is used by the actual application
EXPOSE 3000

# Finally runs the application
CMD [ "npm","run", "start" ]