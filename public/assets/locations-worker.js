watcherId = setInterval(() => {
    postMessage(true)
}, 10000)

onmessage = (data) => {
    clearInterval(watcherId);
}