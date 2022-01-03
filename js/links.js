const main = [
  ...document.getElementById('rso').getElementsByTagName('a'),
].filter(
  (el) =>
    el.parentNode.classList.contains('yuRUbf') &&
    !el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
      'Wt5Tfe'
    )
)

let PAALinks = []
const awaitTimeout = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}
awaitTimeout(900).then(() => {
  PAALinks = [
    ...document.getElementById('rso').getElementsByTagName('a'),
  ].filter(
    (el) =>
      el.parentNode.classList.contains('yuRUbf') &&
      el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
        'Wt5Tfe'
      )
  )
  console.log(PAALinks)
})
/* [
        ...document.getElementById('rso').getElementsByTagName('a'),
      ].filter(
        (el) =>
          el.parentNode.classList.contains('yuRUbf') &&
          el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
            'Wt5Tfe'
          )
      )
      */

//  PAALinks[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText
