chrome.runtime.sendMessage({
	from: 'content',
	subject: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
    const domInfo=document.querySelectorAll('move');
    const moves = Object.keys(domInfo).map((i)=>{return domInfo[i].innerHTML});
    console.log(moves);
    // Directly respond to the sender (popup), 
    // through the specified callback */
    response(moves);
  }
});