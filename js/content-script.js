chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
  switch (response.type) {
    case 'UPDATE_BADGE':
      const number = getWordCount(document.body)
      chrome.runtime.sendMessage({ type: 'ADD_BADGE', number })

      return
  }
})
