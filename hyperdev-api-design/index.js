let tbody = ``;
let apiArray = [];
function openmodal(e) {
    let matchedApi = apiArray.find((api) => {
      return api.url === e.getAttribute("data-id");
    });
    $("#api-name").text("API: " + matchedApi.name);
    $("#api-url").html(matchedApi.url);
    $("#api-description").html(
      "<strong>Description: </strong></br>" + matchedApi.description
    );
    $("#api-parameters").html(
      "<strong>Parameters: </strong></br>" +
        (matchedApi.parameters.length
          ? matchedApi.parameters.join(" - ")
          : "No parameters needed")
    );
    $("#api-token").html(
      matchedApi.authorization
        ? '<strong style="padding:3px 10px;background-color:green;color:white">Need to include token in request</strong>'
        : ""
    );
    $(".modale").addClass("opened");
  }

$(document).ready(function () {
  $.getJSON("ApiDesign.json", function (json) {
    apiArray = json;
    json.forEach((api) => {
      tbody += `<tr>
                  <td>${api.name}</td>
                  <td><span class="api-type-${api.type}">${api.type}<span></td>
                  <td>${
                    api.target === "admin"
                      ? "Admin"
                      : api.target === "application"
                      ? "Mobile"
                      : "Mobile/Admin"
                  }</td>
                  <td>${api.url}</td>
                  <td>${
                    api.authorization
                      ? '<i style="color:green;" class="fa fa-check">'
                      : ""
                  }</td>
                  <td><a class="openmodale" onclick="openmodal(this)" href="#" data-id="${
                    api.url
                  }"><i style="color:#9e7e5d;" class="fa fa-info-circle"></i></a></td>
              </tr>`;
    });
    $("#api-table-tbody").append(tbody);
    $("#api-table").DataTable({
      pageLength: 10,
    });

    $(".closemodale").click(function (e) {
      e.preventDefault();
      $(".modale").removeClass("opened");
    });
  });
});


