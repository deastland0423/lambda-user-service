FROM node:14

WORKDIR /app

RUN npm install -g \
  nodemon \
  serverless

RUN apt-get update
RUN apt-get install -y mysql-client

# install AWS CLI
RUN apt-get install -y python3-pip
RUN pip3 install awscli
RUN mkdir -p ~/.aws
# copy the .dist files and customize with values from your account
COPY config/aws/config ~/.aws/
COPY config/aws/credentials ~/.aws/

EXPOSE 4000

CMD dev/startup.sh

# customize dev environment
RUN sed -i.orig -e "s/# alias ll=/alias ll=/" ~/.bashrc

# keep node_modules directory inside container
RUN mkdir -p /tmp/node_modules
