class Language {
    constructor(path, key, text) {
        this.path = path;
        this.key = key;
        this.text = text;
    }
}

class LanguageParser {

    constructor(path, show) {
        this.path = path;
        this.list = [];
        this.showMe = show;

        this.exportJson = {};

        this.getJson();
    }

    getJson() {
        var self = this;
        $.getJSON( this.path, ( data ) => {
            $.each( data, ( key, val ) => {
                self.addData([], key, val);
            });

            if (self.showMe == true) {
                this.show();
            }

            this.outputText();
        });
    }

    addData(l, k, v) {
        var nl = [...l];
        if (typeof v === "object") {
            nl.push(k);
            $.each( v, ( key, val ) =>{
                this.addData(nl, key, val);
            });
            return;
        }
        this.list.push(new Language(nl, k, v));
    }

    export_pass(mlist, path, key, id) {

        if ( mlist[path[0]] == undefined) {
            if (path.length == 1) {
                mlist[path[0]] = $('[data-id="other-'+id+'"]').val();
                return;
            }else{
                mlist[path[0]] = {};
            }
        }

        var np = [...path];
        np.shift();

        this.export_pass(mlist[path[0]], np, key, id)
    }

    export() {
        this.exportJson = {};

        $.each( this.list, ( key, val ) => {
            this.export_pass(this.exportJson, [...val.path] ,val.key, key)
        });

        download($('.globalname').val()+".json",JSON.stringify(this.exportJson));
    }

    outputText() {
        this.exportJson = {};

        $.each( this.list, ( key, val ) => {
            this.export_pass(this.exportJson, [...val.path] ,val.key, key)
        });

        $(".output-json").html(syntaxHighlight(JSON.stringify(this.exportJson, null, '  ')));


    }

    show() {
        // translate-content
        $.each( this.list, ( key, val ) => {
            var name = val.path;
            name.push(val.key);
            name = name.join('.');

            var text = input_template
                .replaceAll("{{id}}", name)
                .replaceAll("{{num}}", key)
                .replaceAll("{{key}}", val.key);

            $('.translate-content').append(text);
            $('[data-id="'+name+'"]').val(val.text);
        });
    }

    import(data) {
        var savedList = [...this.list];
        this.list = [];
        $.each( data, ( key, val ) => {
            this.addData([], key, val);
        });

        $.each( this.list, ( key, val ) => {
            var n = val.path;
            n.push(val.key);
            n = n.join('.');
            $('[data-path="'+n+'"]').val(val.text);
        });
        this.list = [...savedList];
        this.outputText();
    }
}

$('body').on('click', '[data-node]', function () {
    var currentNode = $(this).data('node');

    var nextNode = $('[data-node="'+(currentNode+1)+'"]');
    if (nextNode.attr('class') != 'key') {

    } else {
        return;
    }

    var nextTruNode = true;
    for (i = currentNode-1; i > 0; i--) {
        var cur = $('[data-node="'+i+'"]');
        console.log('Check: '+i+' / '+cur.attr('class'));
        if  (cur.attr('class') == 'key' && nextTruNode) {
            console.log(cur.text());
            return;
        } else if (cur.attr('class') == 'key') {
            nextTruNode = true;
        } else {
            nextTruNode = false;
        }
    }
});

$('body').on('mouseenter', '[data-node]', function () {
    var currentNode = $(this).data('node');
    var nextNode = $('[data-node="'+(currentNode+1)+'"]');
    if (nextNode.attr('class') != 'key') {
        $(this).css('background', 'gray');
        $(this).css('cursor', 'pointer');
    }
});

$('body').on('mouseleave', '[data-node]', function () {
    var currentNode = $(this).data('node');
    var nextNode = $('[data-node="'+(currentNode+1)+'"]');
    if (nextNode.attr('class') != 'key') {
        $(this).removeAttr('style');
    }
});