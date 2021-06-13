# Base image used only to fix system dependencies
FROM alpine:20210212

RUN apk add --no-cache coreutils=8.32-r2 bash=5.1.4-r0 git=2.31.1-r1 yarn=1.22.10-r0 nodejs=14.16.1-r2
RUN yarn global add ts-node@8.3.0 @angular/cli@11.2.11 @angular/compiler-cli@11.2.12

ENTRYPOINT [ "/bin/false" ]
