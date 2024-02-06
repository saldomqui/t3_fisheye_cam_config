
const fileSelector = document.getElementById('config_file_selector_id');
fileSelector.addEventListener('change', (event) => {
    handleImportConfig(event);
});


function handleImportConfig(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
        var name = f.name;
        var size = f.size;
        if (name == "config.tar.gz") {
            console.log("config file:" + name + " size:" + size);
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    console.log("config.tar.gz file loaded");
                    var bindata = e.target.result;
                    var bytedata = new Uint8Array(bindata);
                    var head = "\r\n------WebKitFormBoundaryXrjvwAVbcGXiqJOi\r\nContent-Disposition: form-data; name=\"file\"; filename=\"" + name + "\"\r\nContent-Type: application/octet-stream\r\n\r\n";

                    var tail = "\r\n------WebKitFormBoundaryXrjvwAVbcGXiqJOi--\r\n";
                    var len = head.length + size + tail.length;
                    var byteArr = new Uint8Array(len);
                    for (var i = 0; i < head.length; i++) {
                        byteArr[i] = head[i].charCodeAt(0);
                    }
                    for (var i = 0; i < size; i++) {
                        byteArr[head.length + i] = bytedata[i];
                    }
                    for (var i = 0; i < tail.length; i++) {
                        byteArr[head.length + size + i] = tail[i].charCodeAt(0);
                    }

                    console.log("Creating HTTP request to the camera...");

                    //console.log(byteArr);

                    var xhr = new XMLHttpRequest();
                    var host = document.getElementById('cam_ip_id').value;
                    var url = "http://" + host + "/import_config";
                    console.log("url:" + url);

                    xhr.open("POST", url);
                    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryXrjvwAVbcGXiqJOi");
                    xhr.send(byteArr);
                    xhr.onload = function () {
                        console.log("Returned status:" + xhr.status);
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            console.log("Import Config Success.");
                        }
                    }.bind(this)
                }.bind(this);
            }.bind(this))(f);
            reader.readAsArrayBuffer(f);
        }
        else {
            console.log("ConfigFile_Invalid");
        }
    }
}
