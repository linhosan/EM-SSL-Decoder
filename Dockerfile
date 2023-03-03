FROM ubuntu:20.04

# Package Manager
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y locales-all
RUN apt-get install -y ssh
RUN apt-get install -y software-properties-common
RUN apt-get install -y curl
RUN curl -sL https://nsolid-deb.nodesource.com/nsolid_setup_4.x | bash -
RUN apt-get install -y nsolid-hydrogen nsolid-console
RUN apt-get install -y vim
RUN apt-get install -y dnsutils
RUN apt-get install -y iputils-ping
RUN apt-get install -y net-tools
RUN apt-get autoremove -y

# EM SSL Decoder
RUN echo ""                           >> /root/.profile
RUN echo ". ~/.cm"                    >> /root/.profile
RUN echo "alias ll=\"ls -la\""        >> /root/.profile
COPY . /root/

# NodeJS
WORKDIR /root/www
RUN npm install

# Permessi e Profile
RUN chmod +x /root/bin/get*

WORKDIR /root/www/

CMD [ "node", "server.js" ]
EXPOSE 4000

