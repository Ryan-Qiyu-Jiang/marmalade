
// Update the relevant fields with the new data
function findNextMove(data) {
  console.log(data);
  nextMove(data);
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('next');

  button.addEventListener('click',()=>{
        // ...query for the active tab...
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          // ...also specifying a callback to be called 
          //    from the receiving end (content script)
          findNextMove);
    });

  });

});