var s3Obj = {};

function createS3InstanceObject(uid){
	s3Obj[uid] = new AWSUsers[uid].S3();
}


function listBuckets(uid, callback) {
	if(s3Obj[uid]){
		s3Obj[uid].listBuckets(function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("listBuckets success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("s3Object is not set for this user.");
	}	
}

/**
 * data = bucket_name
**/
function listFilesInBucket(uid, data, callback) {
	if(s3Obj[uid]){
		s3Obj[uid].listObjects(data,function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("listFilesInBucket success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("s3Object is not set for this user.");
	}
}

module.exports = {
	createS3InstanceObject : createS3InstanceObject,
	listBuckets : listBuckets,
	listFilesInBucket : listFilesInBucket
}