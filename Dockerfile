FROM python:3.9.13-alpine3.16 as basic

FROM basic as builder

RUN mkdir /install
WORKDIR /install
ADD requirements.txt .
ENV PYTHONPATH /install/lib/python3.9/site-packages
RUN pip install --upgrade pip --user --no-warn-script-location --disable-pip-version-check
RUN pip install --force-reinstall --prefix=/install -r requirements.txt --no-warn-script-location


FROM python:3.9.13-alpine3.16

COPY --from=builder /install /usr/local

RUN apk update && apk upgrade

RUN addgroup -g 1000 netadmin
RUN adduser -u 1000 -G netadmin -h /home/netadmin -D netadmin
USER netadmin

RUN mkdir -p /home/netadmin/openeyes_app

WORKDIR /home/netadmin/openeyes_app

COPY --chown=netadmin:netadmin app/ .

CMD ["python", "srv.py"]