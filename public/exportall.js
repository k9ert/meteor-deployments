var myCursor = db.deployments.find({}, {"_id":0});
myCursor.forEach(printjson);
