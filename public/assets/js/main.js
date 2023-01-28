const isFile = /^https:\/\/www\.fshare\.vn\/file\/.+/;
const isFolder = /^https:\/\/www\.fshare\.vn\/folder\/.+/;
let isLight = true;

$(document).ready(function () {
  $.fn.main.formValidation();
  $.fn.main.registerEvent();
  $.fn.main.autocomplete();
});

$.fn.extend({
  element: {
    mainForm: "#mainForm",
    modalFilmSearch: "#filmSearchForm",
    modalggSearch: "#ggSearchForm",
  },
  main: {
    autocomplete: function () {
      $("#filmName").autoComplete({
        resolver: "ajax",
        resolverSettings: {
          url: "/api/ac",
          queryKey: "keyword",
        },
      });
    },
    formValidation: function () {
      $.validator.addMethod(
        "isFsLink",
        function (value, element) {
          return (
            this.optional(element) || isFile.test(value) || isFolder.test(value)
          );
        },
        "Invalid format."
      );

      $($.fn.element.mainForm).validate({
        onfocusout: function (element) {
          $(element).valid();
        },
        rules: {
          original: {
            required: true,
            isFsLink: true,
          },
        },
        errorClass: "error is-invalid",
      });

      $($.fn.element.modalFilmSearch).validate({
        onfocusout: function (element) {
          $(element).valid();
        },
        rules: {
          filmName: {
            required: true,
          },
        },
        errorClass: "error is-invalid",
      });

      $($.fn.element.modalggSearch).validate({
        onfocusout: function (element) {
          $(element).valid();
        },
        rules: {
          ggQuery: {
            required: true,
          },
        },
        errorClass: "error is-invalid",
      });
    },
    registerEvent: function () {
      $(document).on("change", "#original, #password", function (e) {
        e.preventDefault();
        $("#mainForm").valid();
        $("#create").removeAttr("disabled");
        $("#fileName").html("Generated Link");
      });

      $("#download").on("click", function (e) {
        e.preventDefault();
        document.location.href = $("#generated").val();
      });

      $("#openInVLC").on("click", function (e) {
        e.preventDefault();
        document.location.href = `vlc://${$("#generated").val()}`;
      });

      $("#useProxy").on("click", function (e) {
        e.preventDefault();
        $("#generated").val(
          $("#generated").val().replace("fshare.vn", "proxy.phamduy.me")
        );
      });

      $("#create").on("click", function (e) {
        e.preventDefault();
        if (!$("#mainForm").valid()) return;
        const inputURL =
          isFile.test($("#original").val()) ||
          isFolder.test($("#original").val())
            ? $("#original").val()
            : `https://${$("#original").val()}`;
        const password = $("#password").val();
        const $this = $(this);
        $.fn.main.showLoading($this);
        if (isFile.test(inputURL)) {
          $.post(
            "/api/generate",
            { url: inputURL, password: password },
            function (res) {
              $.fn.main.hideLoading($this, "Get Link");
              if (res.code == 200) {
                $("#generated").val(
                  res.location.replace("http://", "https://")
                );
                $("#fileName").html(
                  `File name: <span class='text-success'>${decodeURI(
                    $("#generated").val().split("/").pop()
                  )}</span>`
                );
                $(".action-btn").removeAttr("disabled");
              } else {
                $(".action-btn").prop("disabled", "disabled");
                if (res.code == 123) {
                  $("#generated").val("Invalid file password!");
                } else if (res.code == 404) {
                  $("#generated").val("File not found!");
                } else {
                  $("#generated").val("Something went wrong!");
                }
              }
            }
          );
        } else if (isFolder.test(inputURL)) {
          const code = inputURL.split("?")[0].split("/").pop();
          $.post("/api/getFolder", { code }, function (res) {
            $.fn.main.hideLoading($this, "Get Link");
            let html = `<label>Folder name: <span class='text-success'>${res.current.name}</span></label><select class="form-control" id="files">`;
            for (let i = 0; i < res.items.length; i++) {
              const type = !res.items[i].mimetype ? "folder" : "file";
              html += `<option value="https://www.fshare.vn/${type}/${res.items[i].linkcode}">${res.items[i].name}</option>`;
            }
            html += "</select>";
            $("#itemList").html(html);
            $("#files").on("change click", function (e) {
              e.preventDefault();
              const selected = $(this).find(":selected").val();
              $("#original").val(selected).trigger("change");
            });
          });
        }
      });

      $(".js-textareacopybtn").on("click", function (e) {
        e.preventDefault();
        const outputUrl = $("#generated").val();
        navigator.clipboard.writeText(outputUrl);
      });

      $("#fshareLogo").dblclick(function (e) {
        e.preventDefault();
        if (isLight) {
          $("body").css("background-color", "#242424");
          $("label").css("color", "white");
          isLight = false;
        } else {
          $("body").css("background-color", "");
          $("label").css("color", "");
          isLight = true;
        }
      });

      $("#filmSearch").on("click", function (e) {
        e.preventDefault();
        if (!$("#filmSearchForm").valid()) return;
        const filmName = $("#filmName").val();
        const $this = $(this);
        $.fn.main.showLoading($this);
        $.post("/api/searchFilm", { filmName }, function (res) {
          $.fn.main.hideLoading($this);
          if (res.status == "false") {
            $("#searchData").html(
              `<label class="error is-invalid">No result.</label>`
            );
            return;
          }
          let resultTable = `<table class="table table-hover table-sm">
            <thead class="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>`;
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            resultTable += `<tr>
              <th scope="row">${i + 1}</th>
              <td>
                  <img width="100" src="${element.image}">
              </td>
              <td>${element.title}</td>
              <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select</button>
                <div class="dropdown-menu">`;
            for (let j = 0; j < element.links.length; j++) {
              const link = element.links[j];
              resultTable += `<a class="dropdown-item" data-link="${link.link}">${link.title}</a>`;
            }
            resultTable += `</div></div></td></tr>`;
          }
          resultTable += `</tbody></table>`;
          $("#searchData").html(resultTable);
          $(".dropdown-item").on("click", function () {
            $("#original").val($(this).data("link")).trigger("change");
            $("#staticBackdrop").modal("hide");
          });
        });
      });

      $("#ggSearch").on("click", function (e) {
        e.preventDefault();
        const q = $("#ggQuery").val();
        if (!$("#ggSearchForm").valid()) return;
        const $this = $(this);
        $.fn.main.showLoading($this);
        $.post("/api/ggSearch", { q }, function (res) {
          $.fn.main.hideLoading($this);
          if (res.length == 0) {
            $("#ggSearchData").html(
              `<label class="error is-invalid">No result.</label>`
            );
            return;
          }
          let resultTable = `<table class="table table-hover table-sm">
            <thead class="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Type</th>
                <th scope="col">Name</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>`;
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            resultTable += `<tr>
              <th scope="row">${i + 1}</th>
              <td>${element.link.includes("folder") ? "Folder" : "File"}</td>
              <td>${element.htmlTitle}</td>
              <td>
                  <div class="btn-group">
                      <button type="button" class="btn btn-success search-items" data-link="${
                        element.link
                      }" aria-haspopup="true" aria-expanded="false">Select</button>
                  </div>
              </td>
              </tr>`;
          }
          resultTable += `</tbody></table>`;
          $("#ggSearchData").html(resultTable);
          $(".search-items").on("click", function () {
            $("#original").val($(this).data("link")).trigger("change");
            $("#googleSearch").modal("hide");
          });
        });
      });
    },
    showLoading: function (el) {
      el.html(
        `<span class='spinner-border spinner-border-sm ml-4 mr-4' role='status' aria-hidden='true'></span>`
      ).attr("disabled", true);
    },
    hideLoading: function (el, btnTxt = "Search") {
      el.html(btnTxt).removeAttr("disabled");
    },
  },
});
