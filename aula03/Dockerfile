FROM node:17-slim

RUN apt-get update \
	&& apt-get install -y sox libsox-fmt-mp3
	#libsox-fmt-all pra instala a compatibilidade com qualquer tipo de audio(disponivel na api pelo menos)

WORKDIR /spotify-radio/

COPY package.json yarn.lock /spotify-radio/

RUN yarn

COPY . .

USER node

CMD yarn run live-reload


