meteor-deployments
==================

A meteor-application reading from a mongodb rendering deploymentdata via d3.
The deploymentdata is coming from puppi, a deployment-framework which is
creating that data in a mongodb via it's mongo-reporting-capability

https://github.com/example42/puppi/

https://github.com/example42/puppi/blob/master/files/scripts/report_mongo.sh

The status right now is, that it nitially populates the mongodb and use the db on the client-side, not very nice code yet. The d3-rendering is quite improvable.

To start, simply clone and start meteor.

To test, do that here:
http://puppi-deployments.meteor.com
