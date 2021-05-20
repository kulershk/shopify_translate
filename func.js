var input_template = `
    <div class="row">
        <div class="col-1">{{num}}</div>
        <div class="col-5">
            <div class="input-group mb-2 mt-2">
                <textarea rows="4" disabled data-id="{{id}}"></textarea>
            </div>
        </div>
            
        <div class="col-6">           
            <div class="input-group mb-2 mt-2">
            <button type="button" data-t="{{id}}" onclick="clickTranslate(this)" class="btn btn-primary btn-sm float-right ml-3 translate-button" style="width: 38px;margin: 0 !important;">T</button>
            <textarea style="width: calc(100% - 45px); margin-left: 5px;" rows="4" data-id="other-{{num}}" data-path="{{id}}"></textarea>
            </div>
        </div>
    </div>`;

var parsed = new LanguageParser('en.json', true);


function fileChanged(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    $(".globalname").val(event.target.files[0].name.split(".")[0]);
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

function clickTranslate(event) {
    var t = $(event).attr("data-t");
    var val = $('[data-id="'+t+'"]').val();


    var dataObj = {
        "auth_key": $('.deepl').val(),
        "text": val,
        "target_lang": "FR"
    }

    $.ajax({
        type: "GET",
        url: "https://api-free.deepl.com/v2/translate",
        data: dataObj,
        dataType: 'JSON',
        success: function (response) {
        console.log(response);
            $('[data-path="'+t+'"]').val(response.translations[0].text);
        },
        error: function() {
            alert("it failed");
        }
    });

}

// Start file download.
// download("hello.txt","This is the content of my file :)");