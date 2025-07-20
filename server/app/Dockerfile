FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc postgresql-client
COPY . .
RUN pip install -r requirements.txt
