$(document).ready(function () {
    let isLight = true;
    $(document).on('change', '#original, #password', function (e) {
        e.preventDefault();
        $('#urlError').hide();
        $('#create').removeAttr('disabled');
        $('#fileName').html('Generated Link');
    });

    $(document).on('change', '#filmName', function (e) {
        e.preventDefault();
        $('#urlError').hide();
    });

    $('#download').on('click', function (e) {
        e.preventDefault();
        document.location.href = $('#generated').val();
    });

    $('#openInVLC').on('click', function (e) {
        e.preventDefault();
        document.location.href = `vlc://${$('#generated').val()}`;
    });

    $('#useProxy').on('click', function (e) {
        e.preventDefault();
        $('#generated').val($('#generated').val().replace('fshare.vn', 'proxy.phamduy.me'));
    });

    $('#create').on('click', function (e) {
        e.preventDefault();
        const regEx = /^https:\/\/www\.fshare\.vn\/file\/.+/;
        const regExFolder = /^https:\/\/www\.fshare\.vn\/folder\/.+/;
        const inputURL = regEx.test($('#original').val()) || regExFolder.test($('#original').val())
            ? $('#original').val()
            : `https://${$('#original').val()}`;
        const password = $('#password').val();
        if (regEx.test(inputURL)) {
            $('#create')
                .html(
                    `<span class='spinner-border spinner-border-sm ml-4 mr-4' role='status' aria-hidden='true'></span>`
                )
                .attr('disabled', true);
            $.get('/generate', { url: inputURL, password: password }, function (res) {
                $('#create').html('Get Link');
                if (res.code == 200) {
                    $('#generated').val(res.location.replace('http://', 'https://'));
                    $('#fileName').html(
                        `File name: <span class='text-success'>${decodeURI(
                            $('#generated').val().split('/').pop()
                        )}</span>`
                    );
                    $('#create').removeAttr('disabled');
                    $('.action-btn').removeAttr('disabled');
                } else {
                    $('.action-btn').prop('disabled', 'disabled');
                    if (res.code == 123) {
                        $('#generated').val('Invalid file password!');

                    } else if (res.code == 404) {
                        $('#generated').val('File not found!');

                    } else {
                        $('#generated').val('Something went wrong!');
                    }
                }
            });
        } else if (regExFolder.test(inputURL)) {
            $('#create')
                .html(
                    `<span class='spinner-border spinner-border-sm ml-4 mr-4' role='status' aria-hidden='true'></span>`
                )
                .attr('disabled', true);
            let linkcode = inputURL.split('?')[0];
            linkcode = linkcode.split('/').pop();
            $.get('/getFolder/' + linkcode, function (res) {
                $('#create').html('Get Link');
                let html = '<label>Files</label><select class="form-control" id="files">';
                for (let i = 0; i < res.length; i++) {
                    html += `<option value="https://www.fshare.vn/file/${res[i].linkcode}">${res[i].name}</option>`;
                }
                html += '</select>';
                $('#itemList').html(html);
                $('#create').removeAttr('disabled');
                $('#files').on('change', function (e) {
                    e.preventDefault();
                    const selected = $(this).find(":selected").val();
                    $('#original').val(selected).trigger('change');
                });
            });
        } else {
            $('#urlError').show();
        }
    });

    $('.js-textareacopybtn').on('click', function (e) {
        e.preventDefault();
        const outputUrl = $('#generated').val();
        navigator.clipboard.writeText(outputUrl);
    });

    $('#fshareLogo').dblclick(function (e) {
        e.preventDefault();
        if (isLight) {
            $('body').css('background-color', '#242424');
            $('label').css('color', 'white');
            isLight = false;
        } else {
            $('body').css('background-color', '');
            $('label').css('color', '');
            isLight = true;
        }
    });

    $('#filmSearch').on('click', function (e) {
        e.preventDefault();
        const filmName = $('#filmName').val();
        if (filmName != '') {
            $(this)
                .html(
                    `<span class='spinner-border spinner-border-sm ml-4 mr-4' role='status' aria-hidden='true'></span>`
                )
                .attr('disabled', true);
            $.get(`/searchFilm/${encodeURIComponent(filmName)}`, function (res) {
                $('#filmSearch').html('Search');
                $('#filmSearch').removeAttr('disabled');
                if (res.status == "false") {
                    $('#searchData').html('No result');
                    return;
                }
                let resultTable = `<table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>`;
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    resultTable += `<tr>
                <th scope="row">${i + 1}</th>
                <td>
                    <img width="100" src="${element.image}" alt="">
                </td>
                <td>${element.title}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select Link</button>
                    <div class="dropdown-menu">`;
                    for (let j = 0; j < element.links.length; j++) {
                        const link = element.links[j];
                        resultTable += `<a class="dropdown-item" data-link="${link.link}">${link.title}</a>`;
                    }
                    resultTable += `</div></div></td></tr>`;
                }
                resultTable += `</tbody></table>`;
                $('#searchData').html(resultTable);
                $('.dropdown-item').on('click', function () {
                    $('#original').val($(this).data('link'));
                    $('#staticBackdrop').modal('hide');
                });
            });
        } else {
            $('#searchError').show();
        }
    });
});