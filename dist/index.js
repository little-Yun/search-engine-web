var pageSize = 10;

$(function () {
    $('#search-btn').click(function () {
        var $results = $('#results');
        $('#results').empty();
        if ($('#search-input').val() == "") {
            $results.append("<div class='text-center'><h4>请先输入关键词</h4></div>")
        } else {
            ajaxPage(1);
        }
    });
});

function createNode(wiki) {
    return $('<div class="item">\n' +
        '          <a class="item-url" target="_blank" href="' + wiki.url + '">' + wiki.title + '</a>\n' +
        '          <br>\n ' +
        '          <span id="item-brief">' + wiki.brief + '</span>&nbsp;\n' +
        '          <br>\n ' +
        '          <span class="item-body">' + wiki.body + '</span>\n' +
        '          <div style="color: #969696">相关度:\n' +
        '               <span id="query-sim">' + wiki.source + '</span>\n' +
        '          </div>' +
        '   </div>');
}

function ajaxPage(page) {
    $.ajax({
        url: "http://localhost:8888/es/query/agg",
        type: "GET",
        data: {
            param: $('#search-input').val(),
            from: (page - 1) * pageSize,
        },
        success: function (data) {
            $('#results').empty();
            var $results = $('#results');
            if (data != null) {
                $results.get(0).data = data.data.wikiList;
                $.each(data.data.wikiList, function (index, value) {
                    var item = createNode(value);
                    item.get(0).data = value;
                    $results.append(item);
                });
                $("#myPage").sPage({
                    page: page,
                    total: data.data.wikiCount,
                    pageSize: 10,
                    showTotal: true,
                    totalTxt: "共{total}条",
                    showPN: true,
                    prevPage: "上一页",
                    nextPage: "下一页",
                    backFun: function (page) {
                        ajaxPage(page);
                    }
                });
            } else {
                $results.append("<div>无数据</div>")
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
