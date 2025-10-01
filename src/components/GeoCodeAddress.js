import { rootStore } from '../stores/rootStore';
import { filterAddress } from './GetAppLocation';

const myApiKey = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';

let dalta = {
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0321,
};

let manageRideDalta = {
  latitudeDelta: 0.0650,
  longitudeDelta: 0.0650,
}

export const getGeoCodes = (latitude, longitude) => {
  console.log('latitude, longitude', latitude, longitude);
  const { setCurrentAddress } = rootStore.myAddressStore;
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
        console.log('responseJson---', responseJson);
        if (responseJson.status === 'OK') {
          console.log('responseJson---', responseJson?.results);
          const shortAddress = filterAddress(responseJson?.results?.[0]?.formatted_address)
          // console.log("shortAddress----", shortAddress);
          const data = {
            address: shortAddress ? shortAddress : responseJson?.results?.[0]?.formatted_address,
            place_Id: responseJson?.results?.[0]?.place_id,
            geo_location: responseJson?.results?.[0]?.geometry?.location,
          };
          setCurrentAddress(data);
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
  // if (data.latitudeDelta <= 0.0602 && data.longitudeDelta <= 0.0501) {
  (dalta.latitudeDelta = data.latitudeDelta),
    (dalta.longitudeDelta = data.longitudeDelta);
  dalta = a;
  // }
}

export function setMpaDaltaInitials() {
  let a = { latitudeDelta: 0.0322, longitudeDelta: 0.0321 };
  dalta = a;
}



// export function getMapManageRideDalta(distanceMeter) {
//   let distance = (distanceMeter / 1000).toFixed(2)
//   let a = manageRideDalta;
//   if (distance > 0 && distance < 2) {
//     alert(1)
//     (manageRideDalta.latitudeDelta = 0.0322),
//       (manageRideDalta.longitudeDelta = 0.0322);
//     manageRideDalta = a;
//     return a;
//   }
//   else if (distance > 0 && distance < 2) {
//     alert(2)
//     (manageRideDalta.latitudeDelta = 0.0322),
//       (manageRideDalta.longitudeDelta = 0.0322);
//     manageRideDalta = a;
//     return a;
//   }
//   else if (distance > 3 && distance < 6) {
//     alert(3)
//     (manageRideDalta.latitudeDelta = 0.10),
//       (manageRideDalta.longitudeDelta = 0.12);
//     manageRideDalta = a;
//     return a;
//   } else if (distance >= 6 && distance < 10) {
//     alert(4)
//     (manageRideDalta.latitudeDelta = 0.15),
//       (manageRideDalta.longitudeDelta = 0.20);
//     manageRideDalta = a;
//     return a;
//   }
//   else if (distance >= 10 && distance < 16) {
//     alert(5)
//     (manageRideDalta.latitudeDelta = 0.25),
//       (manageRideDalta.longitudeDelta = 0.30);
//     manageRideDalta = a;
//     return a;

//   } else if (distance >= 16 && distance < 24) {
//     alert(6)
//     (manageRideDalta.latitudeDelta = 0.35),
//       (manageRideDalta.longitudeDelta = 0.40);
//     manageRideDalta = a;
//     return a;
//   }
//   else if (distance >= 24 && distance < 30) {
//     alert(7)
//     (manageRideDalta.latitudeDelta = 0.45),
//       (manageRideDalta.longitudeDelta = 0.50);
//     manageRideDalta = a;
//     return a;
//   } else {
//     alert(8)
//     return manageRideDalta;
//   }



// }
export function getMapManageRideDalta(distanceMeter) {
  const distance = (distanceMeter / 1000).toFixed(2); // in km
  const newDelta = { ...manageRideDalta }; // clone original

  const d = parseFloat(Number(distance)); // convert string back to number
  // console.log("d--", d);
  // if (d > 0 && d < 1) {
  //   newDelta.latitudeDelta = 0.03;
  //   newDelta.longitudeDelta = 0.03;
  // }
  // else if (d >= 1 && d < 2) {
  //   newDelta.latitudeDelta = 0.04;
  //   newDelta.longitudeDelta = 0.04;
  // } else if (d >= 2 && d < 3) {
  //   newDelta.latitudeDelta = 0.08;
  //   newDelta.longitudeDelta = 0.08;
  // } else if (d >= 3 && d < 6) {
  //   newDelta.latitudeDelta = 0.12;
  //   newDelta.longitudeDelta = 0.12;
  // } else if (d >= 6 && d < 10) {
  //   newDelta.latitudeDelta = 0.20;
  //   newDelta.longitudeDelta = 0.20;
  // } else if (d >= 10 && d < 16) {
  //   newDelta.latitudeDelta = 0.25;
  //   newDelta.longitudeDelta = 0.25;
  // } else if (d >= 16 && d < 24) {
  //   newDelta.latitudeDelta = 0.30;
  //   newDelta.longitudeDelta = 0.30;
  // } else if (d >= 24 && d < 30) {
  //   newDelta.latitudeDelta = 0.35;
  //   newDelta.longitudeDelta = 0.35;
  // } else {
  //   newDelta.latitudeDelta = 0.0650;
  //   newDelta.longitudeDelta = 0.0650;
  // }
  // manageRideDalta = newDelta;
  return newDelta;
}


export function setMapManageRideDalta(data) {
  let a = manageRideDalta;
  // if (data.latitudeDelta <= 0.0602 && data.longitudeDelta <= 0.0501) {
  (manageRideDalta.latitudeDelta = data.latitudeDelta),
    (manageRideDalta.longitudeDelta = data.longitudeDelta);
  manageRideDalta = a;
  // }
}

export function setMapManageRideDaltaInitials() {
  let a = { latitudeDelta: 0.0650, longitudeDelta: 0.0650 };
  manageRideDalta = a;
}





