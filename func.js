var input_template = `
    <div class="row">
    
        <div class="col-6">
            <div class="input-group mb-2 mt-2">
                <textarea rows="4" disabled data-id="{{id}}"></textarea>
            </div>
        </div>
            
        <div class="col-6">
            <div class="input-group mb-2 mt-2">
            <textarea rows="4" data-id="other-{{num}}" data-path="{{id}}"></textarea>
            </div>
        </div>
    </div>`;

var parsed = new LanguageParser('en.json', true);
var globalname = "name";

function fileChanged(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    globalname = event.target.files[0].name.split(".")[0];
    reader.readAsText(event.target.files[0]);
}
document.getElementById('formFile').addEventListener('change', fileChanged);


function onReaderLoad(event){
    try {
        var obj = JSON.parse(event.target.result);
        parsed.import(obj);
    } catch (e) {
        alert("Cant load this file");
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
// download("hello.txt","This is the content of my file :)");