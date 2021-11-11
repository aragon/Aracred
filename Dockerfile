FROM node:lts

ENV SOURCECRED_GITHUB_TOKEN=""
ENV SOURCECRED_DISCORD_TOKEN=""

RUN mkdir -p /app
RUN groupadd -r appuser && useradd -r -g appuser -G audio,video appuser \
    && mkdir -p /home/appuser/Downloads \
    && chown -R appuser:appuser /home/appuser \
    && chown -R appuser:appuser /app

# Run everything after as non-privileged user.
USER appuser

WORKDIR /app

COPY --chown=appuser:appuser . /app
RUN chmod u+x /app/entrypoint.sh

RUN yarn --frozen-lockfile --non-interactive
ENTRYPOINT ["/app/entrypoint.sh"]