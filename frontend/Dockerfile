
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install && \
    npm install typescript sass tailwindcss && \
    npm install -g http-server

RUN npx tsc --project tsconfig.json

RUN npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --minify

EXPOSE 6565 

CMD ["http-server", ".", "-p", "6565", "-s", "-d"]