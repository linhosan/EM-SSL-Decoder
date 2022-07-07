FROM ubuntu:18.04

# Package Manager
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y locales-all \
                       ssh \
                       software-properties-common \
 && apt-get install -y curl \
 &&   curl -sL http://nsolid-deb.nodesource.com/nsolid_setup_3.x | bash - \
 && apt-get install -y nsolid-dubnium nsolid-console \
                       vim \
 && apt-get autoremove -y

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

WORKDIR /root

ARG DEBUG=${DEBUG}
ENV DEBUG=${DEBUG}

CMD [ "node", "www/server.js" ]
EXPOSE 4000

