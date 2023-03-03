/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
    const escape = function (str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
  
    const loadTweets = function () {
      $.ajax({
        url: "/tweets",
        type: "GET",
      })
        .then((response) => {
          renderTweets(response);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    };
  
    loadTweets();
  
    const avatarType = function (avatar) {
      const regex = new RegExp("^http");
  
      if (regex.test(avatar)) {
        return `<img src=${avatar}/>`;
      } else {
        return avatar;
      }
    };
  
    const createTweetElement = function (obj) {
      const $tweet = `
          <article class = "tweet-container">
              <header>
                ${
                  obj.user.avatars
                    ? avatarType(obj.user.avatars)
                    : '<i class="fas fa-user-secret fa-2x"></i>'
                }
                <div class="username">
                  ${obj.user.name}
                </div>
                <div class="user-id">
                  ${obj.user.handle}
                </div>
              </header>
              <div class="tweet-content">
                ${escape(obj.content.text)}
              </div>
              <footer>
                <div class="date-posted">
                  ${timeago.format(obj.created_at)}
                </div>
                <div class="tweet-actions">
                  <a href="#"><i class="fas fa-flag"></i></a>
                  <a href="#"><i class="fas fa-retweet"></i></a>
                  <a href="#"><i class="fas fa-heart"></i></a>
                </div>
              </footer>
            </article>
        `;
      return $tweet;
    };
  
    const renderTweets = function (tweets) {
      $("#tweets-container").empty();
      for (let tweetObj of tweets) {
        const $tweet = createTweetElement(tweetObj);
        $("#tweets-container").prepend($tweet);
      }
    };
  
    $(".new-tweet form").on("submit", function (e) {
      e.preventDefault();
      const $inputField = $(this).find("#tweet-text").val();
      $("#error-blank").slideUp();
      $("#error-exceed").slideUp();
  
      if ($inputField.length < 1) {
        $("#error-blank").slideDown();
      } else if ($inputField.length > 140) {
        $("#error-exceed").slideDown();
      } else {
        const $formData = $(this).serialize();
  
        $.ajax({
          url: "/tweets",
          type: "POST",
          data: $formData,
        })
          .then(() => {
            $(this).children("#tweet-text").val("");
            $(this).find(".counter").html("140");
            loadTweets();
          })
          .catch((error) => {
            console.log("error:", error);
          });
      }
    });
  });
  
