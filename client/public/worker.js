let arrayChunks = [];
self.addEventListener("message", event => {
    if (event.data === "download") {
        const blob = new Blob(arrayChunks);
        self.postMessage(blob);
        console.log("Doneeee", blob)
        //download(blob);
        arrayChunks = [];
    } else {
        arrayChunks.push(event.data);
    }
})