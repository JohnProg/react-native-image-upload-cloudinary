export function apiError(response) {
  this.name = 'KheloMore API Error';
  this.statusCode = response.statusCode || 0;
  this.error = response.error || 'API Error';
  this.message = response.message || 'Some error occured';
  this.stack = (new Error()).stack;
}
apiError.prototype = Object.create(Error.prototype);
apiError.prototype.constructor = apiError;