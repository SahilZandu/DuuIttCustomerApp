export const DuuittMapTheme = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#E5E9EC" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#58606B" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#FFFFFF", "weight": 2 }] // Changed to white for better readability
  },
  
  // ENABLE LAND PARCEL LABELS (includes mall areas)
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "visibility": "on" }, { "color": "#062c5bff" }]
  },
  
  // ENABLE NEIGHBORHOOD NAMES
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.fill", 
    "stylers": [{ "visibility": "on" }, { "color": "#1976D2" }]
  },
  
  // ENABLE ALL POI LABELS (MALLS, SHOPS, BUSINESSES)
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{ "visibility": "on" }] // This enables mall names
  },
  {
    "featureType": "poi",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "on" },{ "color": "#949494" }] // Show POI icons, keep text
  },
  
  // SPECIFIC POI TYPES - MALLS ARE UNDER poi.business
  {
    "featureType": "poi.business",
    "elementType": "labels.text.fill",
    "stylers": [{ "visibility": "on" }, { "color": "#7F848A" }] // Malls in red
  },
  {
    "featureType": "poi.medical",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#7F848A" }]
  },
  {
    "featureType": "poi.school",
    "elementType": "labels.text.fill", 
    "stylers": [{ "color": "#7F848A" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "visibility": "on" }, { "color": "#7F848A" }] // Parks in green
  },
  
  // ENABLE ALL ROAD LABELS
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "visibility": "on" }] // Enable ALL road labels
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#7F848A" }]
  },
  {
    "featureType": "road.highway", 
    "elementType": "geometry",
    "stylers": [{ "color": "#ABBADA" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#7F848A" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#7F848A" }]
  },
  
  // ENABLE ADDRESS NUMBERS
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{ "visibility": "on" }, { "color": "#58606B" }]
  },
  
  // Hide transit only
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#4955e2ff" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#58606B" }]
  }
];


// export const DuuittMapTheme = [
//   {
//     "elementType": "geometry",
//     "stylers": [{ "color": "#E5E9EC" }]
//   },
//   {
//     "elementType": "labels.icon",
//     "stylers": [{ "visibility": "off" }]
//   },
//   {
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#58606B", }]
//   },
//   {
//     "elementType": "labels.text.stroke",
//     "stylers": [{ "color": "#003051ff", "weight": 20 }]
//   },
//   {
//     "featureType": "administrative.land_parcel",
//     "stylers": [{ "visibility": "off" }]
//   },
//   {
//     "featureType": "administrative.neighborhood",
//     "stylers": [{ "visibility": "off" }]
//   },
//   // SPECIFICALLY ENABLE SHOPS AND BUSINESSES
//   {
//     "featureType": "poi",
//     "elementType": "labels",
//     "stylers": [{ "visibility": "on" }]
//   },
//   {
//     "featureType": "poi.business",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#062c5bff" }] // Business names in blue
//   },
//   {
//     "featureType": "poi.medical",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#D32F2F" }] // Medical facilities in red
//   },
//   {
//     "featureType": "poi.school",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#1976D2" }] // Schools in blue
//   },
//   // {
//   //   "featureType": "poi",
//   //   "elementType": "labels.text",
//   //   "stylers": [{ "visibility": "off" }]
//   // },
//   {
//     "featureType": "poi.business",
//     "stylers": [{ "visibility": "off" }]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "labels.text",
//     "stylers": [{ "visibility": "off" }]
//   },
//     // ENABLE LAND PARCEL LABELS (includes mall areas)
//   {
//     "featureType": "administrative.land_parcel",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "visibility": "on" }, { "color": "#062c5bff" }]
//   },
  
//   // ENABLE NEIGHBORHOOD NAMES
//   {
//     "featureType": "administrative.neighborhood",
//     "elementType": "labels.text.fill", 
//     "stylers": [{ "visibility": "on" }, { "color": "#1976D2" }]
//   },
  
//   // ENABLE ALL POI LABELS (MALLS, SHOPS, BUSINESSES)
//   {
//     "featureType": "poi",
//     "elementType": "labels.text",
//     "stylers": [{ "visibility": "on" }] // This enables mall names
//   },
//   {
//     "featureType": "poi",
//     "elementType": "labels.icon",
//     "stylers": [{ "visibility": "on" }] // Hide POI icons, keep text
//   },
  
//   // SPECIFIC POI TYPES - MALLS ARE UNDER poi.business
//   {
//     "featureType": "poi.business",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "visibility": "on" }, { "color": "#e6dfdfff" }] // Malls in red
//   },
//   {
//     "featureType": "poi.medical",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#58606B" }]
//   },
//   {
//     "featureType": "poi.school",
//     "elementType": "labels.text.fill", 
//     "stylers": [{ "color": "58606B" }]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "visibility": "on" }, { "color": "#2E7D32" }] // Parks in green
//   },
  

//   // ENABLE ROAD NAMES
//   {
//     "featureType": "road",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#ffffff", }]
//   },

//   {
//     "featureType": "road.arterial",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#062c5bff", }]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#ABBADA" }]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#7F848A" }]
//   },
//   {
//     "featureType": "road.local",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#58606B" }]
//   },
//   //   // ENABLE ADDRESS NUMBERS
//   {
//     "featureType": "administrative",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "visibility": "on" }, { "color": "#58606B" }]
//   },
//   {
//     "featureType": "transit",
//     "stylers": [{ "visibility": "off" }]
//   },
//   {
//     "featureType": "water",
//     "elementType": "geometry",
//     "stylers": [{ "color": "#4955e2ff", }]
//   },
//   {
//     "featureType": "water",
//     "elementType": "labels.text.fill",
//     "stylers": [{ "color": "#58606B" }]
//   }
// ];