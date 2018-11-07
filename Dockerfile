FROM node:9

EXPOSE 3000
ENV GOSU_VERSION 1.10
RUN set -ex \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && curl -Lo /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }')" \
  # Causes too many errors Relying on SSL for now
  # && curl -Lo /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }').asc" \
  # && export GNUPGHOME="$(mktemp -d)" \
  # && gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
  # && gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
  # && rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc \
  && chmod +x /usr/local/bin/gosu \
  && gosu nobody true \
  && apt-get purge -y --auto-remove ca-certificates wget

# Set timezone to EST
# RUN apk add --no-cache tzdata
# RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Free up the UID/GID 33 because that happens to be the one goshin uses
# run deluser xfs
run deluser www-data

ARG UID=765
ARG GID=765
RUN addgroup --gid $GID --system www-data && adduser --system --gid $GID -u $UID www-data

WORKDIR /code/

CMD ["yarn", "run", "start"]
