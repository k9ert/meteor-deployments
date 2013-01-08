meteor-deployments
==================

A meteor-application reading from a mongodb rendering deploymentdata via d3.
The deploymentdata is coming from puppi, a deployment-framework which is
creating that data in a mongodb via it's mongo-reporting-capability

https://github.com/example42/puppi/

https://github.com/example42/puppi/blob/master/files/scripts/report_mongo.sh

The status right now is, that it reads from a json-file and d3-rendering is quite improvable.
That json file is also loaded into the meteor-mongo-db but the data is still
used from the json-file.

To start, simply clone and start meteor.
