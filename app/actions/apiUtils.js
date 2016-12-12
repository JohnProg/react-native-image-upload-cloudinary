
import { apiError } from './errors';

export function getFetch(url) {
   console.log(url);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      reject("getFetch" + error);
    });
  });
}

export function postFetch(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response);
}

export function postFile(url, formData) {
  return fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then(response => response);
}

function getToken() {
  const token = localStorage.getItem('KHELOMORE_ADMIN_TOKEN');
  return token;
}
