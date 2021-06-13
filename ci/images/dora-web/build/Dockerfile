# Work image, entrypoint reclones repo if necessary
FROM docker.io/alanmpinder/dora-web-base:20210613

EXPOSE 4200

COPY "work" "/work"

ENTRYPOINT [ "/work/entrypoint.sh" ]
