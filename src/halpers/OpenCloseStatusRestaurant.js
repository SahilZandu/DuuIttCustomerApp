export function getTodayRestaurantTimings(timingsData) {
    const now = new Date();
    const todayIndex = now.getDay(); // 0 = Sunday, 6 = Saturday
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const formatTime = (timeStr) => {
        const [hourStr, minuteStr] = timeStr?.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = ((hour + 11) % 12) + 1;
        return `${formattedHour}:${minuteStr} ${suffix}`;
    };

    let todayTimings = [];

    if (timingsData?.is_all_day && timingsData?.all_days?.timings?.length > 0) {
        if (!timingsData?.all_days?.outlet_status) return 'Closed';
        todayTimings = timingsData?.all_days?.timings;
    } else {
        const today = timingsData?.specified?.[todayIndex !== 0 ? todayIndex - 1 : 6];
        if (!today || !today?.outlet_status || today?.timings?.length === 0) return 'Closed';
        todayTimings = today?.timings;
    }

    for (let timing of todayTimings) {
        const [openHour, openMin] = timing?.open_times.split(':').map(Number);
        const [closeHour, closeMin] = timing?.close_time.split(':').map(Number);

        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;

        if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
            return `${formatTime(timing?.open_times)} - ${formatTime(timing?.close_time)}`;
        }
    }

    return 'Closed';
};




//   const getTodayTimings = (timingsData) => {
//     const now = new Date();
//     const todayIndex = now.getDay(); // 0 = Sunday, 6 = Saturday
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
//     const formatTime = (timeStr) => {
//       const [hourStr, minuteStr] = timeStr?.split(':');
//       const hour = parseInt(hourStr, 10);
//       const minute = parseInt(minuteStr, 10);
//       const suffix = hour >= 12 ? 'PM' : 'AM';
//       const formattedHour = ((hour + 11) % 12) + 1;
//       return `${formattedHour}:${minuteStr} ${suffix}`;
//     };
  
//     let todayTimings = [];
  
//     if (timingsData?.is_all_day && timingsData?.all_days?.timings?.length > 0) {
//       if (!timingsData?.all_days?.outlet_status) return 'Closed';
//       todayTimings = timingsData?.all_days?.timings;
//     } else {
//       const today = timingsData?.specified?.[todayIndex !== 0 ? todayIndex - 1 :6];
//       if (!today || !today?.outlet_status || today?.timings?.length === 0) return 'Closed';
//       todayTimings = today?.timings;
//     }
  
//     for (let timing of todayTimings) {
//       const [openHour, openMin] = timing?.open_times.split(':').map(Number);
//       const [closeHour, closeMin] = timing?.close_time.split(':').map(Number);
  
//       const openMinutes = openHour * 60 + openMin;
//       const closeMinutes = closeHour * 60 + closeMin;
  
//       if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
//         return `${formatTime(timing?.open_times)} - ${formatTime(timing?.close_time)}`;
//       }
//     }
  
//     return 'Closed';
//   };