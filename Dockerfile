FROM centos:8.1.1911
ARG BUILD_DATE
LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.opencontainers.image.created=$BUILD_DATE
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum -y install nodejs ruby rubygems git
RUN gem install r10k
WORKDIR /app
COPY . /app
RUN npm install
CMD node api/api.js
