### Installare Docker (Linux/Unix/Mac) oppure Docker Desktop (Windows) dal [sito ufficiale](https://www.docker.com/)

### Aprire una shell (Linux/Unix/Mac) oppure il CMD (Windows), scaricare ed avviare "EM SSL Decoder"

```
docker pull linhosan/em-ssl-decoder:latest

docker run -d --restart unless-stopped \
  --privileged \
  --name EM_SSL_Decoder \
  --hostname em_ssl_decoder \
  -p 4000:4000 \
  linhosan/em-ssl-decoder:latest
```

### Navigare tramite browser sulla nuova istanza locale di [EM SSL Decoder](http://localhost:4000/)