var input_template = `
    <div class="row">
        <div class="col-12">{{id}}</div>
    </div>
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

$('body').on('change keyup paste', '[data-path]', () => {
    myEfficientFn();
});

var myEfficientFn = debounce(() => {
    parsed.outputText();
}, 250);

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

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
        "target_lang": $(".tlang").val()
    }

    $.ajax({
        type: "GET",
        url: "https://api-free.deepl.com/v2/translate",
        data: dataObj,
        dataType: 'JSON',
        success: function (response) {
        console.log(response);
            $('[data-path="'+t+'"]').val(response.translations[0].text);
            if (translating) {
                translateNext();
            }
        },
        error: function() {
            alert("it failed");
        }
    });

}

translating = false;
translateNr = 0;
function translateAll() {
    if (translating) {
        return;
    }
    translating = true;
    translateNext();
}

function translateNext() {
    $('.translate-button').eq(translateNr).click();
    translateNr++;
}


function syntaxHighlight(json) {
    var num = 0;

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        num++;
        return '<span class="' + cls + '" data-node="'+num+'">' + match + '</span>';
    });
}

// Start file download.
// download("hello.txt","This is the content of my file :)");