FROM node:iron-alpine AS build-stage

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --network-timeout 240000

COPY src/ src/
COPY public/ public/
COPY tsconfig.json .
COPY .prettierrc .
COPY .eslintignore .
COPY .eslintrc.json .
COPY .env .

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.29-alpine

# Toggle visibility of cookie policy, privacy policy, and terms & conditions
ENV AKSA_SHOW_LEGAL_DOCUMENTS='false'

# Override the server address for API calls
ENV AKSA_SERVER_URL=''

# Override the websocket address for API calls
ENV AKSA_WEBSOCKET_URL=''

# Server port
ENV AKSA_LISTEN_PORT='8080'

# Analytics variables
ENV AKSA_ANALYTICS_DATA_DOMAIN=''
ENV AKSA_ANALYTICS_SRC=''
ENV AKSA_CLARITY_ID=''

COPY ./nginx.conf /etc/nginx/templates/aksa.local.conf.template
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf


