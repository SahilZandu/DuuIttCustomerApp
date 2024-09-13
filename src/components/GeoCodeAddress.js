const myApiKey = 'AIzaSyB8ndrqIS-d0t2Y3v_w6OqaOw1qmxC8aEw';

let dalta = {
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0321,
};

export const getGeoCodes = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        myApiKey,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson---',responseJson);
        if (responseJson.status === 'OK') {
          console.log('responseJson---',responseJson?.results);
          const data ={
            address:responseJson?.results?.[0]?.formatted_address,
            place_Id:responseJson?.results?.[0]?.place_id,
          }
          resolve(data);
          // resolve(responseJson?.results?.[0]?.formatted_address);
        } else {
          // resolve('not found')
          reject('not found');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};


export function getMpaDalta() {
  return dalta;
}

export function setMpaDalta(data) {
  let a = dalta;
  (dalta.latitudeDelta = data.latitudeDelta),
    (dalta.longitudeDelta = data.longitudeDelta);

  dalta = a;
}
