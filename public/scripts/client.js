/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
    // Function to prevent XSS. createTextNode escapes HTML characters 'e.g. <>'
    const escape = function (str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
  
    // Function to asynchronously fetch tweet data from '/tweets' via AJAX GET
    // If successful, it will call the renderTweets function above and pass it the JSON response data that is returned from the request as an argument
    // This function will also be invoked after every successful POST request when a tweet is submitted
    const loadTweets = function() {
      $.ajax({
        url: '/tweets',
        type: 'GET',
      })
      .then((response) => {
        renderTweets(response);
      })
      .catch((error) => {
        console.log('error:', error)
      })
    }
  
    loadTweets();
  
    // Checks whether the avatars property contains an http link or an svg class from one of the project libraries
    // For instance, this can be a valid avatar property without an http link --> "avatars": "<i class=\"fas fa-user-secret fa-2x\"></i>"
    const avatarType = function(avatar) {
      const regex = new RegExp("^http");
  
      if (regex.test(avatar)) {
        return `<img src=${avatar}/>`;
      } else {
        return avatar;
      }
    };
  
    const createTweetElement = function(obj) {
      const $tweet = `
        <article class = "tweet-container">
            <header>
              ${obj.user.avatars ? avatarType(obj.user.avatars) : '<i class="fas fa-user-secret fa-2x"></i>'}
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
  
    const renderTweets = function(tweets) {
      // loops through tweets
      $('#tweets-container').empty();
      for (let tweetObj of tweets) {
        // calls createTweetElement for each tweet
        // takes return value and appends it to the tweets container
        const $tweet = createTweetElement(tweetObj);
        $('#tweets-container').prepend($tweet);
      }
    };
  
    // prevent page from navigating upon form submission
    $('.new-tweet form').on('submit', function(e) {
      // prevent default form behaviour
      e.preventDefault();
      const $inputField = $(this).find('#tweet-text').val();
      // remove any present error messages upon submit
      $('#error-blank').slideUp();
      $('#error-exceed').slideUp();
  
      // validation for tweet lengths
      if ($inputField.length < 1) {
        $('#error-blank').slideDown();
      } else if ($inputField.length > 140) {
        $('#error-exceed').slideDown();
      } else {
        const $formData = $(this).serialize();
        
        // asynchronously send the data to server
        $.ajax({
          url: '/tweets',
          type: 'POST',
          data: $formData
        })
        .then(() => {
          // clear new tweet input field
          $(this).children('#tweet-text').val('');
          // reset counter 
          $(this).find('.counter').html('140');
          // fetch tweets from DB and render them to page
          loadTweets();
        })
        .catch((error) => {
          console.log('error:', error)
        })
      }
    });
    
  
  });
  