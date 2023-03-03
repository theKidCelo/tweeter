$(document).ready(function() {

  $('#tweet-text').on('input', function() {
    // assign textarea's sibling child element (.counter) a variable
    const $counter = $(this).next().children('.counter');
    const remainingChars = 140 - this.value.length;

    // change inner html of $counter upon char input
    $counter.html(remainingChars);

    // change counter colour depending on chars remaining
    if (remainingChars < 0) {
      $counter.addClass('red');
    } else {
      $counter.removeClass('red');
    }
  });

});