FROM python:3.8

LABEL Maintainer="platform_engineering@omegalabs.io"

WORKDIR /app

COPY . /app

RUN pip --version

RUN pip install -r requirements.txt

CMD [ "python", "main.py" ]