# from https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
FROM node:16-alpine
RUN apk add dumb-init
ENV NODE_ENV production
EXPOSE 8000/tcp

WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --only=production
RUN mkdir -p /var/log/nodeapp && chown node:node /var/log/nodeapp
USER node
CMD ["dumb-init", "node", "index.js"]
