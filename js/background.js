let currentURL = ''

// fires when tab is updated
chrome.tabs.onUpdated.addListener((tabId) => {
  console.log(tabId)
  console.log('updating')
  updateBadgeandUpdateActionPage(tabId, false)
})

// fires when active tab changes
chrome.tabs.onActivated.addListener((tabId) => {
  let id = tabId
  typeof tabId === 'object' && (id = tabId.tabId)
  console.log(id)
  console.log('updating')
  updateBadgeandUpdateActionPage(id, true)
})

async function updateBadgeandUpdateActionPage(id, reset) {
  if (reset) {
    chrome.action.setBadgeText({ text: '' })
  }
  chrome.tabs.sendMessage(id, { type: 'UPDATE_BADGE' })
  chrome.tabs.sendMessage(id, { type: 'CHANGE_ACTION' })
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  console.log(tab)
  return tab
}
let i = 0
chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
  switch (response.type) {
    case 'GET_HTML':
      fetchURL(response.link, sendResponse)
      return true
    case 'ADD_BADGE':
      return chrome.action.setBadgeText({ text: response.number.toString() })
    case 'TEST_RESPONSE':
      return sendResponse({ type: 'TEST_RECEIVE_RESPONSE' })
  }
})

chrome.action.onClicked.addListener((tab) => {
  // alert('sup')
  // // console.log(tab)
  // console.log('sup')
})

async function fetchURL(link, sendResponse) {
  try {
    const res = await fetch(link)
    const html = await res.text()
    sendResponse({ type: 'RECEIVE_HTML', html, link })
  } catch (error) {
    sendResponse({ type: 'LINK_ERROR', link, error })
  }
}
async function hellooooo(link) {
  try {
    const res = await fetch(link)
    const html = await res.text()
    return html
  } catch (error) {
    return
  }
}
