meteor-deployments
==================

A meteor(ite)-application reading from a mongodb rendering deploymentdata via d3.
The deploymentdata is coming from puppi, a deployment-framework which is
creating that data in a mongodb via it's mongo-reporting-capability

https://github.com/example42/puppi/

https://github.com/example42/puppi/blob/master/files/scripts/report_mongo.sh

To start, simply:

<pre>
$ apt-get install nodejs npm
$ sudo -H npm install -g meteorite
$ git clone https://github.com/k9ert/meteor-deployments.git
$ cd meteor-deployments
# connect to your 
$ export MONGO_URL=mongodb://somemongodb.somedomain.com:27017/deployments
$ mrt
</pre>


To test, do that here:
http://puppi-deployments.meteor.com

Deployment Reporting 
====================

The deployment-data is stored in a mongoDB and looks like this:
<pre>
{
    _id: ObjectId("50bc72d875331f9b9d398c25"),
    ts: ISODate("2012-12-03T09:37:28%:z"),
    result: "OK",
    fqdn: "int2-udp1.somedomain.com",
    project: "udp.ui.web",
    source: "https://repository.somedomain.com/release/com/somedomain/udp/udp-ui-web",
    tag: "20121203-043703",
    version: "0.4.0",
    artifact: "udp-ui-web",
    warfile: "udp-ui-web-0.4.0.war",
    environment: "int2"
}
</pre>

If you don't want to implement the reporting, you can install mongodb-clients 
and use puppi with built-in mongo-reporting which basically uses this script:
``` bash
#!/bin/bash
set +x
# report_mongodb.sh - Made for Puppi
# This script sends a summary to a mongodb defined in $1
# e.g. somemongohost/dbname

# Sources common header for Puppi scripts
. $(dirname $0)/header || exit 10


if [ "$EXITCRIT" = "1" ] ; then
    proposed_exit=2
fi

if [ "$EXITWARN" = "1" ] ; then
    proposed_exit=1
fi

# check prerequisites
mongo -version > /dev/null
if [ $? -ne 0 ]; then
        echo "mongo-client is not installed, aborting"
        exit $proposed_exit
fi

fqdn=$(facter fqdn)

environment=$(facter environment -p)

# something like mongodb://someuser:hispassword@somehost/somedb
mongourl=$1

if [[ ! $mongourl =~ "mongodb://" ]]; then
  echo "WARNING: mongourl invalid! Please use a valid monurl!"
  exit $proposed_exit
fi

if [[ $mongourl =~ @ ]]; then
  # ok we have to deal with passwords
  # you HAVE to provide a password if you provide a user
  mongodb=`echo $mongourl | sed 's/.*@//'`
  mongouser=`echo $mongourl | sed 's/mongodb:\/\///' | sed 's/:.*//' `
  mongopassword=`echo $mongourl | sed 's/mongodb:\/\///' | sed 's/[^:]*://' | sed 's/@.*//' `
  mongoarguments="--username $mongouser --password $mongopassword"
else
  mongodb=`echo $mongourl | sed 's/mongodb:\/\///'` 	
fi

result=$(grep result $logdir/$project/$tag/summary | awk '{ print $NF }')
summary=$(cat $logdir/$project/$tag/summary)

mcmd="db.deployments.insert({ts:new Date(),result:\"${result}\",fqdn:\"${fqdn}\",project:\"${project}\",source:\"${source}\",tag:\"${tag}\",version:\"${version}\",artifact:\"${artifact}\",testmode:\"${testmode}\",warfile:\"${warfile}\",environment:\"${environment}\"}); quit(0)"


mongo $mongoarguments $mongodb --eval "$mcmd"

# Now do a reporting to enable "most-recent-versions on all servers"

read -r -d '' mcmd <<'EOF'
var map = function() {
  project=this.project ;
  emit( this.fqdn +":"+ this.project,  {project:this.project, fqdn:this.fqdn, ts:this.ts,version:this.version,environment:this.environment}  );
};
var reduce = function(k,vals) {
  result = vals[0];
  vals.forEach(function(val) { if (val.ts > result.ts) result=val } ) ;
  return result;
};
db.deployments.mapReduce(
  map,
  reduce,
  {out:{replace:"versions"}})
EOF

mongo $mongoarguments $mongodb --eval "$mcmd"

exit $proposed_exit
```
