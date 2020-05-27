### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY . .

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

# ENV NODE_ENV=production

RUN yarn install

## Build the react app in production mode and store the artifacts in dist folder

RUN npx react-scripts build

### STAGE 2: Setup ###

FROM nginx:1.17-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]