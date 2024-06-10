FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/bin:$PATH
COPY package.json .
COPY web.config .
RUN npm i
COPY . .
## RUN npm run build teste
## EXPOSE [Port you mentioned in the vite.config file]
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]