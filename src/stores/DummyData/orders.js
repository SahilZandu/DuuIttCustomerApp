import {appImages} from '../../commons/AppImages';

export const ordersArray = [
  {
    id: 1,
    image: appImages.order1,
    name: 'Suraya Fast Food',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Delivered',
    price: 250,
    itemArray: [
      {
        id: 1,
        name: 'Manchurian with Fried Rice',
        type: 'veg',
        qty: 2,
      },
      {
        id: 2,
        name: 'Special Chicken Biriyani',
        type: 'non-veg',
        qty: 2,
      },
    ],
    statusOrder:'food'
  },
  {
    id: 2,
    image: appImages.order2,
    name: '',
    tracking_id: 'N8881765',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Delivered',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
    ],
    statusOrder:'parcel'
  },
  {
    id: 3,
    image: appImages.order3,
    name: '43 Bus Stand Road',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Ride Completed',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
      
    ],
    statusOrder:'ride'
  },

  {
    id: 4,
    image: appImages.order1,
    name: 'Suraya Fast Food',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Delivered',
    price: 250,
    itemArray: [
      {
        id: 1,
        name: 'Manchurian with Fried Rice',
        type: 'veg',
        qty: 2,
      },
      {
        id: 2,
        name: 'Special Chicken Biriyani',
        type: 'non-veg',
        qty: 2,
      },
    ],
    statusOrder:'food'
  },
  {
    id: 5,
    image: appImages.order2,
    name: '',
    tracking_id: 'N8881765',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Delivered',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
      
    ],
    statusOrder:'parcel'
  },
  {
    id: 6,
    image: appImages.order3,
    name: '43 Bus Stand Road',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Ride Completed',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
     
    ],
    statusOrder:'ride'
  },
  {
    id: 7,
    image: appImages.order1,
    name: 'Suraya Fast Food',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Canceled',
    price: 250,
    itemArray: [
      {
        id: 1,
        name: 'Manchurian with Fried Rice',
        type: 'veg',
        qty: 2,
      },
      {
        id: 2,
        name: 'Special Chicken Biriyani',
        type: 'non-veg',
        qty: 2,
      },
    ],
    statusOrder:'food'
  },
  {
    id: 8,
    image: appImages.order2,
    name: '',
    tracking_id: 'N8881765',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Canceled',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
     
    ],
    statusOrder:'parcel'
  },
  {
    id: 9,
    image: appImages.order3,
    name: '43 Bus Stand Road',
    tracking_id: '',
    date: 'Jul 25. 2024 - 10:30 AM',
    status: 'Canceled',
    price: 250,
    itemArray: [
      {
        id: 1,
        pickup_drop: 'Pickup location',
        pickup: 'Phase 5, Sector 59, Sahibzada Ajit...',
        drop: 'TDI TAJ PLAZA Block-505',
      },
     
    ],
    statusOrder:'ride'
  },
];
