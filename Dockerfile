FROM node:22-alpine

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app
COPY --chown=510:510 . .
RUN cd backend/ && npm install

ENTRYPOINT [ "node", "backend/main.js" ]
