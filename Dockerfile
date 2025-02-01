FROM redis:latest 

ENV REDIS_APPENDONLY="yes"

EXPOSE 6379

COPY ./config/redis.conf /usr/local/etc/redis/redis.conf

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
