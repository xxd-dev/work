function parseTimes(times) {
    const lines = times.split('\n');
    const timeEntries = [];
    
    lines.forEach((line) => {
      const [timeString, description] = line.split('; ');
      const time = new Date(timeString);
      timeEntries.push({time, description});
    });
    
    return timeEntries;
}

function getTimeDifferenceInMinutes(startDate, endDate, roundTo) {
    const diffInMilliseconds = endDate - startDate;
    const diffInMinutes = Math.round(diffInMilliseconds / 60000);
    return Math.round(diffInMinutes / roundTo) * roundTo;
}

function formatTimeFromMinutes(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}

function main() {
    var tasks = {};
    const end = "END";
    const url = new URL(window.location.href);
    var times = url.searchParams.get('times');

    var rounding = 15
    if (url.searchParams.has("r")) {
        rounding = url.searchParams.get('r');
    }

    times = parseTimes(times);
    if (times[times.length-1].description != end) {
        endTime = new Date(times[0].time.getTime());
        endTime.setHours(endTime.getHours() + 8, endTime.getMinutes() + 30);
        times.push({
            time: endTime,
            description: "END"
        })
    }

    for (let i=0; i< times.length-1; i++) {
        time = times[i].time;
        time2 = times[i+1].time;
        description = times[i].description;
        if (!(description in tasks)) {
            tasks[description] = 0;
        }
        tasks[description] += getTimeDifferenceInMinutes(time, time2, rounding);
    }

    for (const key of Object.keys(tasks)) { 
        if (key != end) {
            document.getElementById("main").innerHTML += `<pre>${key.padEnd(15, " ")} ${formatTimeFromMinutes(tasks[key])}</pre>`;
            console.log(key + ": ", formatTimeFromMinutes(tasks[key])); 
        }        
    };
}
