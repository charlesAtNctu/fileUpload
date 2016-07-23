Array.from(document.querySelectorAll('img')).forEach(function (selector) {
    selector.addEventListener('click', uploadFile)
})

function getBase64Image(img, extension) {
    // Create an empty canvas element
    var canvas = document.createElement('canvas');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using 'image/jpg'
    // will re-encode the image.
    var dataURL = canvas.toDataURL('image/' + extension);

    return dataURL;
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


function uploadFile(e) {
    var img         = e.target,
        imgPath     = img.src,
        pathParts   = imgPath.split('/'),
        filename    = pathParts[pathParts.length - 1],
        extension   = filename.split('.')[1],
        imgData     = getBase64Image(img, extension),
        formData    = new FormData(),
        xhttp       = new XMLHttpRequest(),
        file

    file = dataURItoBlob(imgData)
    formData.append('uploads[]', file, filename)

    img.parentElement.classList.remove('img-error')
    img.parentElement.classList.add('img-uploading')

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if(xhttp.status == 200) {
                setTimeout(showSuccess.bind(this), 1500)
            } else {
                setTimeout(showError.bind(this), 1500)
            }

        }
    }.bind(this);

    xhttp.open('POST', '/upload');
    xhttp.send(formData);
}

function showSuccess() {
    this.parentElement.classList.remove('img-uploading')
}

function showError() {
    this.parentElement.classList.remove('img-uploading')
    this.parentElement.classList.add('img-error')
}
