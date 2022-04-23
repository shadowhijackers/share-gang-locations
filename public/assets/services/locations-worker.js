watcherId = setInterval(() => {
    postMessage(true)
}, 5000)

onmessage = (data) => {
    clearInterval(watcherId);
}