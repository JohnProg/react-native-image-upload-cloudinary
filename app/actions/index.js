import { getFetch, postFile } from './apiUtils';
import { apiError, notFound, callCb } from './actionUtils';

export function uploadFileToCloudinary(file, resourceType, successCallback, errorCallback) {
   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQwNSRnUEhaL0tmSkIvb0tWMDB3WVpFOTUuODlOLk1zdlllNXV6bTBIUUJBT25NVHNKRGhyTWE5NiIsIl9fdiI6MCwidXNlclJvbGUiOiJjb2FjaCIsIm1vYmlsZU51bWJlciI6Ijg5NDA1NDQwNzMiLCJlbWFpbCI6ImdhdXJhdmt1bWFyMDE1NkBnbWFpbC5jb20iLCJuYW1lIjoidGVzdFJhdGluZyIsInVwZGF0ZWRBdCI6IjIwMTYtMTItMDVUMDg6MTk6MzQuNjEyWiIsImNyZWF0ZWRBdCI6IjIwMTYtMTItMDVUMDg6MTk6MzQuNTk1WiIsIl9pZCI6IjU4NDUyMzE2MDA1MmZmMTljZjBkYmFkZSIsImlhdCI6MTQ4MDkyNjA1OH0.lChwzkPDGbpuZ-mN7s2mpTHK0E-_qgnUmqTZoF35fSg';
	return new Promise((resolve, reject) => { 
	    getCloudinaryCredentials(resourceType, token)
	    .then(response => {
	    console.log(response);
		const data = getFormDataForCloudinary(file, response);
		return postFile(response.url, data);
	    })
	    .then(response => {
	    	console.log(response);
	      resolve(callCb(successCallback, response));
	    })
	    .catch(error => {
	      reject(error);
	    });
	});
}

export function getCloudinaryCredentials(resourceType, token) {
	return getFetch(`http://khelomoredev-api-staging.herokuapp.com/api/upload/cloudinary-credentials?token=${token}&resourceType=${resourceType}`);
}

export function getFormDataForCloudinary(file, credentials) {
	const data = new FormData();
	const { api_key, signature, timestamp } = credentials;
	data.append('file', file);
	data.append('api_key', api_key);
	data.append('timestamp', timestamp);
	data.append('signature', signature);
	return data;
}
