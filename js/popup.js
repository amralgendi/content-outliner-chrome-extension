// console.log('hey')

// setTimeout(async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

//   chrome.scripting.executeScript(getOutline, (res) => console.log(res))
// }, 1000)

// function getOutline() {
//   const headings = [...document.querySelectorAll('h1,h2,h3')]

//   headings.map((el, i) => console.log(i, el.innerText.trim()))
//   console.log(headings)
//   return 'hey'
// }

//Executed when the extension's icon is clicked
setTimeout(() => {
  console.log(document.body)
  const logoImage = chrome.runtime.getURL('/images/logo-32.png')
  console.log(logoImage)
  document.querySelector('.extension.header').querySelector('img').src =
    logoImage
}, 0)

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

function getTitleandHeadings(id) {
  const title = document.title
  const headings = [...document.querySelectorAll('h1, h2, h3')]
  const headingDetails = []
  headings.map((h) => {
    headingDetails.push({ tagName: h.tagName, text: h.innerText.trim() })
  })
  return {
    title,
    headings: headingDetails,
  }
}
setTimeout(async () => {
  const tabId = await getCurrentTab()
  // console.log(tabId)
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId.id, allFrames: true },
      func: getTitleandHeadings,
    },
    (injectionResults) => {
      const detailsDom = document.querySelector('.extension.details')

      // console.log(injectionResults[0].result)
      const { headings } = injectionResults[0].result
      // console.log(headings)
      headings.map((h) => {
        // console.log(h.tagName)
        detailsDom.innerHTML += `<div class="extension checkbox">
                <label class="extension"
                  ><input
                    class="extension input-checkbox"
                    type="checkbox"
                    checked=""
                  /><span class="extension checkmark"></span
                  ><span class="extension heading${h.tagName[1]} icon">${
          h.tagName
        }</span
                  ><span class="extension heading${
                    h.tagName[1]
                  }" data-heading="${h.tagName}"
                    >${h.text.split(/\s+/).join(' ')}</span
                  ></label
                >
              </div>`
      })
      detailsDom.innerHTML += ``
    }
  )

  const checkboxes = [...document.querySelectorAll('.extension.options input')]
  checkboxes.map((ch) => {
    ch.addEventListener('change', (e) =>
      changeChecked(e.target.parentNode.innerText.trim(), e.target.checked)
    )
  })
  const copyBtn = document.querySelector('.extension.copy-btn')
  copyBtn.addEventListener('click', () => {
    let copiedText = ''
    const allCheckboxes = [
      ...document.querySelectorAll('.extension.details input'),
    ]
    allCheckboxes.map(
      (ch) =>
        ch.checked &&
        (copiedText += `${
          ch.parentNode.querySelectorAll('span')[2].dataset.heading
        }  ${ch.parentNode.querySelectorAll('span')[2].innerText} \n`)
    )
    navigator.clipboard.writeText(copiedText)
  })
}, 200)

const changeChecked = (tagName, isChecked) => {
  // console.log(tagName, isChecked)
  const allCheckBoxes = [
    ...document.querySelectorAll('.extension.input-checkbox'),
  ]
  allCheckBoxes.map(
    (ch) =>
      ch.parentNode.querySelectorAll('span')[2].dataset.heading === tagName &&
      (ch.checked = isChecked)
  )
}
