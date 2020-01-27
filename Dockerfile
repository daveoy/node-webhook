FROM centos:8.1.1911
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum -y install nodejs ruby rubygems git
RUN gem install r10k
WORKDIR /app
COPY . /app
RUN npm install
CMD node api/api.js
