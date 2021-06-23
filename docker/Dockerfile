#Pulling latest version of node
FROM node:dubnium

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add project files to the docker container
ADD . /usr/src/app

# yarn install will also build as a side effect
RUN yarn install

# Exposing default port
EXPOSE 3000
