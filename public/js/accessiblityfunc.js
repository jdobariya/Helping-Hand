window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("footer").getElementsByTagName("p")[0].innerHTML =
    "&copy; " + new Date().getFullYear() + " Helping Hands, Inc";
});

//slider
let noContent = document.getElementsByClassName("empty");
if (noContent.length > 0) {
  $("#next").prop("disabled", true);
}

var eventSliderIndex = 2;
$(".homepage-events .card").css({ "max-width": "33%", display: "none" });
for (let card = 0; card < 3; card++) {
  $(`.homepage-events .card-${card}`).css("display", "");
}
$("#pre").html("<");
$("#next").html(">");
$("#pre").prop("disabled", true);

function showNextEvent(event) {
  $("#pre").prop("disabled", false);
  eventSliderIndex++;
  if ($(".homepage-events .card").length - 1 === eventSliderIndex) {
    $("#next").prop("disabled", true);
  }
  $(`.homepage-events
    .card-${eventSliderIndex}`).css("display", "");
  $(`.homepage-events
    .card-${eventSliderIndex - 3}`).css("display", "none");
}
function showPreEvent(event) {
  $("#next").prop("disabled", false);
  if (eventSliderIndex === 3) {
    $("#pre").prop("disabled", true);
  }
  $(`.homepage-events .card-${eventSliderIndex}`).css("display", "none");
  $(`.homepage-events .card-${eventSliderIndex - 3}`).css("display", "");
  eventSliderIndex--;
}

//sorting
let eCard = $(".event-row-container .card");
let hCard = $(".homepage-events .card");

function trimCardText(els) {
  Array.prototype.forEach.call(els, function (el) {
    el.getElementsByClassName("card-text")[0].innerHTML =
      el
        .getElementsByClassName("card-text")[0]
        .textContent.trim()
        .substring(0, 100)
        .trim()
        .replace(/.$/, "") + "...";
  });
}
trimCardText(eCard);
trimCardText(hCard);

function sortEventBy(arg, sel, elem, order, by) {
  var $selector = $(sel);
  var $element = $selector.children(elem);
  $element.sort(function (a, b) {
    if (by === "popularity" || by === "recent") {
      var an = parseInt(a.getAttribute(arg)),
        bn = parseInt(b.getAttribute(arg));
    } else if (by === "due") {
      var an = new Date(a.getAttribute(arg)),
        bn = new Date(b.getAttribute(arg));
    }
    if (order == "asc") {
      if (an > bn) return 1;
      if (an < bn) return -1;
    } else if (order == "desc") {
      if (an < bn) return;
      1;
      if (an > bn) return -1;
    }
    return 0;
  });
  $element.detach().appendTo($selector);
}
function sortEvent(sortBy) {
  if (sortBy === "recent") {
    sortEventBy(
      `data-${sortBy}`,
      "#events \
    .row",
      "div",
      "desc",
      sortBy
    );
  } else if (sortBy === "due") {
    sortEventBy(`data-${sortBy}`, "#events .row", "div", "asc", sortBy);
  } else if (sortBy === "popularity") {
    sortEventBy(
      `data-${sortBy}`,
      "#events\
    .row",
      ".card",
      "desc",
      sortBy
    );
  }
}

function registerEvent(event_id) {
  let requestConfig = {
    url: `${event_id}`,
    method: "PATCH",
    data: { reqType: "register" },
  };

  $.ajax(requestConfig).then(function (responseMessage) {
    if (responseMessage.success) {
      alert("Registed Successfully!");
      let btn = `<button
      type="submit"
      id="unregister-btn"
      onclick="UnRegisterEvent('${event_id}')"
    >
    UNREGISTER
    </button>`;

      $("#event-r-btn").html(btn);
    } else {
      alert("Something went wrong! Please try again later.");
    }
  });
}

function UnRegisterEvent(event_id) {
  let requestConfig = {
    url: `${event_id}`,
    method: "PATCH",
    data: { reqType: "unregister" },
  };

  $.ajax(requestConfig).then(function (responseMessage) {
    if (responseMessage.success) {
      alert("Unregistered Successfully!");
      let btn = `<button
      type="submit"
      id="register-btn"
      onclick="registerEvent('${event_id}')"
    >
    REGISTER NOW
    </button>`;

      $("#event-r-btn").html(btn);
    } else {
      alert("Something went wrong! Please try again later.");
    }
  });
}

//like event

function likeEvent(ele, event_id) {
  if (!event_id) alert("Must provide event id");
  if (typeof event_id !== "string") alert("Event id must be of type string");
  let requestConfig = {
    url: `events`,
    method: "PATCH",
    data: { reqType: "like", event_id },
  };
  if (localStorage.getItem("status") === "loggedIn") {
    $.ajax(requestConfig).then(function (responseMessage) {
      if (responseMessage.success) {
        ele.parentElement.getElementsByClassName("likeCount")[0].innerHTML =
          responseMessage.likeCount;
      } else {
        alert("Something went wrong! Please try again later.");
      }
    });
  } else {
    window.location.href = "/profile";
  }
}
