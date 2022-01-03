function stringToHTML(str) {
  console.log(str)
  // str = str.replace(/<!--(.*?)-->/gm, '')
  // let i = 0
  // do {
  //   i = 0
  //   if (str.indexOf('<script') >= 0) i++
  //   const startScript = str.indexOf('<script')
  //   const endScript = str.indexOf('</script>') + 9

  //   str = str.replace(str.substring(startScript, endScript), '')
  // } while (i > 0)
  // do {
  //   i = 0
  //   if (str.indexOf('<style') >= 0) i++
  //   const startScript = str.indexOf('<style')
  //   const endScript = str.indexOf('</style>') + 8

  //   str = str.replace(str.substring(startScript, endScript), '')
  // } while (i > 0)

  var parser = new DOMParser()
  var doc = parser.parseFromString(str, 'text/html')
  console.log(doc)
  return doc
}

// document.getElementById('rcnt').style.display = 'flex'
// document.getElementById('rcnt').style.flexDirection = '';

const e = React.createElement
const domContainer = document.createElement('div')
const belowLink = document.createElement('p')
const belowLinkArr = []

domContainer.id = 'extension'
getComputedStyle(document.body).direction === 'ltr'
  ? (domContainer.className = 'extension container ltr')
  : (domContainer.className = 'extension container rtl')

document
  .getElementById('rcnt')
  .insertBefore(domContainer, document.getElementById('rcnt').childNodes[1])

class Container extends React.Component {
  state = {
    linkResults: [],
  }
  componentDidMount() {
    const linksInOrder = []
    main.map((el) => {
      chrome.runtime.sendMessage(
        {
          type: 'GET_HTML',
          link: el.href,
        },
        (res) => {
          switch (res.type) {
            case 'RECEIVE_HTML':
              const newHTML = stringToHTML(res.html)

              const wordNum = wordCount(newHTML.body)
              belowLinkArr.push({ link: res.link, wordNum })
              const headingElems = [...newHTML.querySelectorAll('h1, h2, h3')]
              const headings = []
              const allsubWordNum = [
                ...document.querySelectorAll('.extension.word-count'),
              ]
              allsubWordNum.map((p) => p.remove())

              belowLinkArr.map((l) => {
                main.map((a) => {
                  if (a.href === l.link) {
                    const p = document.createElement('p')
                    p.innerHTML = `<img src="${bookImg}" class="extension book-icon">:  ${l.wordNum}  <span class="extension tooltiptext">Number of Words</span>`
                    p.className = 'extension word-count tooltip'
                    p.style.direction = 'ltr'
                    a.parentNode.parentNode.appendChild(p)
                  }
                })
              })
              headingElems.map((h) => {
                headings.push(`${h.tagName} ${h.innerText.trim()}`)
              })
              main.map(
                (a, i) =>
                  a.href === res.link &&
                  (linksInOrder[i] = {
                    title: a.href,
                    wordNum,
                    headings,
                  })
              )

              return this.setState((prevState) => ({
                linkResults: linksInOrder,
              }))
          }
        }
      )
    })
  }
  render() {
    return e('div', { className: 'extension sub-container' }, [
      e(Header),
      e(Main, { links: this.state.linkResults }),
    ])
  }
}
class Header extends React.Component {
  render() {
    const expandnShrink = (prop) => {
      const allDetails = [...document.querySelectorAll('.extension.details')]
      allDetails.map(
        (el) =>
          (el.style.visibility = prop) &&
          (el.style.height = prop === 'hidden' ? '0' : 'auto')
      )
    }
    return e('div', { className: 'extension header' }, [
      e('h1', {}, [
        e('img', {
          src: logoImg,
          className: 'extension logo-extension',
        }),
        'Content Outliner',
      ]),
      e('div', { className: 'extension buttons-container' }, [
        e(
          'button',
          {
            className: 'extension copyAll expand-btn',
            onClick: () => expandnShrink('visible'),
          },
          ['Expand All']
        ),
        e(
          'button',
          {
            className: 'extension copyAll expand-btn',
            onClick: () => expandnShrink('hidden'),
          },
          ['Collapse All']
        ),
      ]),
    ])
  }
}
class Main extends React.Component {
  render() {
    const changeCheckedOptions = (tagName, isChecked) => {
      console.log(tagName, isChecked)
      const allCheckboxes = [
        ...document.querySelectorAll('.extension.input-checkbox'),
      ]
      allCheckboxes.map((ch) => {
        ch.parentNode.querySelectorAll('span')[2].dataset.heading === tagName &&
          (ch.checked = isChecked)
      })
      // const hOfT = []
      // headings.map((h) => {
      //   h.split(' ', 2)[0] === tagName && hOfT.push(h)
      // })
      // const newState = { checked: [...this.state.checked] }
      // if (isChecked) {
      //   hOfT.map(
      //     (h) => !newState.checked.includes(h) && newState.checked.push(h)
      //   )
      //   this.setState(newState)
      // } else {
      //   hOfT.map(
      //     (h) =>
      //       newState.checked.includes(h) &&
      //       (newState.checked = newState.checked.filter((el) => el !== h))
      //   )
      //   this.setState(newState)
      // }
    }
    // const changeCheckedOptions = (tagname, ischecked) => {
    //   const allCheckboxes = [
    //     ...document.querySelectorAll('.extension.input-checkbox'),
    //   ]
    //   allCheckboxes.map((ch) => {
    //     ch.parentNode.querySelector('span').dataset.heading === tagname &&
    //       (ch.checked = ischecked)
    //   })
    // }
    const arrLinks = []
    this.props.links.map((link) => {
      arrLinks.push(e(Result, { details: link }))
    })
    const copyAll = () => {
      const allCheckboxes = [
        ...document.querySelectorAll('.extension.input-checkbox'),
      ]
      let copiedText = ''
      allCheckboxes.map((ch) => {
        console.log(ch.parentNode)
        ch.checked === true &&
          (copiedText +=
            (ch.parentNode.querySelectorAll('span')[2].dataset.heading !== 'PAA'
              ? ch.parentNode.querySelectorAll('span')[2].dataset.heading + '  '
              : '') +
            ch.parentNode.querySelectorAll('span')[2].innerHTML +
            '\n')
      })
      navigator.clipboard.writeText(copiedText)
    }
    return e('div', { className: 'extension results-container' }, [
      e('div', { className: 'extension options-container' }, [
        e(
          'div',
          { className: 'extension options' },
          e(Options, {
            changeCheckedOptions,
          })
        ),
        e(
          'button',
          { className: 'extension copy-btn', onClick: (e) => copyAll(e) },
          [
            e(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '14',
                height: '14',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                className: 'extension svg-copy',
              },
              [
                e('rect', {
                  x: '9',
                  y: '9',
                  width: '13',
                  height: '13',
                  rx: '2',
                  ry: '2',
                }),
                e('path', {
                  d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
                }),
              ]
            ),
            'Copy All',
          ]
        ),
      ]),

      ...arrLinks,
      e(PAAContainer),
    ])
  }
}
class Result extends React.Component {
  state = {
    showDetails: true,
  }
  render() {
    const toggleDetails = (e) => {
      console.log(e.target.tagName)
      console.log(e.target.parentNode)

      const detailsDOM =
        e.target.tagName === 'P' || e.target.tagName === 'SPAN'
          ? e.target.parentNode.parentNode.querySelector('.details')
          : e.target.parentNode.querySelector('.details')
      console.log(detailsDOM)
      console.log(getComputedStyle(detailsDOM).visibility)
      if (getComputedStyle(detailsDOM).visibility === 'hidden') {
        detailsDOM.style.visibility = 'visible'
        detailsDOM.style.height = 'auto'
      } else {
        detailsDOM.style.visibility = 'hidden'
        detailsDOM.style.height = '0'
      }
    }
    const { title, wordNum, headings } = this.props.details
    if (this.state.showDetails === false) {
      return e(
        'div',
        {
          className: 'extension result',
          onClick: (e) => toggleDetails(e),
        },
        [
          e('div', { className: 'extension link-title arrow-down' }, [
            e('p', {}, [`${title}`]),
            e('span', {}, `${title}`),
          ]),
        ]
      )
    } else {
      return e('div', { className: 'extension result' }, [
        e(
          'div',
          {
            className: 'extension link-title arrow-up',
            onClick: (e) => toggleDetails(e),
          },
          [e('p', {}, `${title}`), e('span', {}, `${title}`)]
        ),
        e(ResultDetails, { headings }),
      ])
    }
  }
}

class ResultDetails extends React.Component {
  state = {
    checked: [...this.props.headings],
  }
  render() {
    const { headings } = this.props
    const copyOutline = (event) => {
      const allCheckboxes = [
        ...event.target.parentNode.querySelectorAll(
          '.extension.input-checkbox'
        ),
      ]

      let copiedText = ''
      allCheckboxes.map(
        (ch) =>
          ch.checked === true &&
          (copiedText +=
            ch.parentNode.querySelectorAll('span')[2].dataset.heading +
            '  ' +
            ch.parentNode.querySelectorAll('span')[2].innerText +
            '\n')
      )
      navigator.clipboard.writeText(copiedText)
    }
    const checkClassname = (tagName) => {
      switch (tagName) {
        case 'H1':
          return 'extension heading1'
        case 'H2':
          return 'extension heading2'
        case 'H3':
          return 'extension heading3'
      }
    }
    const headingImage = (tagName) => {
      switch (tagName) {
        case 'H1':
          return H1Img
        case 'H2':
          return H2Img
        case 'H3':
          return H3Img
      }
    }
    const changeChecked = (heading) => {
      if (this.state.checked.includes(heading)) {
        const newcheckedState = this.state.checked.filter((h) => h !== heading)
        this.setState(() => ({ checked: newcheckedState }))
      } else {
        this.setState((prevState) => ({
          checked: [...prevState.checked, heading],
        }))
      }
    }

    const headingsEl = []
    headings.map((h) => {
      const splitted = h.split(' ', 2)
      if (h.split(' ')[1].length > 1) {
        headingsEl.push(
          e(
            'div',
            { className: 'extension checkbox' },
            e('label', { className: 'extension' }, [
              e(Input, {
                isChecked: this.state.checked.includes(h),
                changeChecked,
                h,
              }),
              e('span', { className: 'extension checkmark' }),
              e(
                'span',
                {
                  className: `${checkClassname(splitted[0])} icon`,
                },
                `${splitted[0]}`
              ),
              e(
                'span',
                {
                  className: checkClassname(splitted[0]),
                  'data-heading': splitted[0],
                },
                [`${h.substring(3)}`]
              ),
            ])
          )
        )
      }
    })
    return e('div', { className: 'extension details' }, [
      ...headingsEl,
      e(
        'button',
        { className: 'extension copy-btn', onClick: (e) => copyOutline(e) },
        [
          e(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '14',
              height: '14',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '2',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              className: 'extension svg-copy',
            },
            [
              e('rect', {
                x: '9',
                y: '9',
                width: '13',
                height: '13',
                rx: '2',
                ry: '2',
              }),
              e('path', {
                d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
              }),
            ]
          ),
          'Copy',
        ]
      ),
    ])
  }
}
class Input extends React.Component {
  render() {
    const { isChecked, changeChecked, h } = this.props
    return e('input', {
      className: 'extension input-checkbox',
      type: 'checkbox',
      defaultChecked: true,
    })
  }
}

class Options extends React.Component {
  render() {
    const { changeCheckedOptions } = this.props

    return e(React.Fragment, {}, [
      e('label', { className: 'extension' }, [
        e('input', {
          type: 'checkbox',
          defaultChecked: true,
          onChange: (e) => changeCheckedOptions('H1', e.target.checked),
        }),
        e('span', { className: 'extension checkmark' }),
        'H1',
      ]),
      e('label', { className: 'extension' }, [
        e('input', {
          className: 'extension',
          type: 'checkbox',
          defaultChecked: true,
          onChange: (e) => changeCheckedOptions('H2', e.target.checked),
        }),
        e('span', { className: 'extension checkmark' }),
        'H2',
      ]),
      e('label', { className: 'extension' }, [
        e('input', {
          className: 'extension',
          type: 'checkbox',
          defaultChecked: true,
          onChange: (e) => changeCheckedOptions('H3', e.target.checked),
        }),
        e('span', { className: 'extension checkmark' }),
        'H3',
      ]),
      e('label', { className: 'extension' }, [
        e('input', {
          type: 'checkbox',
          defaultChecked: true,
          onChange: (e) => changeCheckedOptions('PAA', e.target.checked),
        }),
        e('span', { className: 'extension checkmark' }),
        'PAA',
      ]),
    ])
  }
}
class PAAContainer extends React.Component {
  state = {
    showDetails: true,
    links: [],
  }
  _isMounted = false
  componentDidMount() {
    this._isMounted = true
    awaitTimeout(1000).then(() => {
      this._isMounted &&
        PAALinks.map((el) => {
          this.setState((prevState) => ({
            showDetails: prevState.showDetails,
            links: [...prevState.links, { link: el.href }],
          }))
        })
    })
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const toggleDetails = (e) => {
      console.log(e.target.tagName)
      console.log(e.target.parentNode)

      const detailsDOM =
        e.target.tagName === 'P' || e.target.tagName === 'SPAN'
          ? e.target.parentNode.parentNode.querySelector('.details')
          : e.target.parentNode.querySelector('.details')
      console.log(detailsDOM)
      console.log(getComputedStyle(detailsDOM).visibility)
      if (getComputedStyle(detailsDOM).visibility === 'hidden') {
        detailsDOM.style.visibility = 'visible'
        detailsDOM.style.height = 'auto'
      } else {
        detailsDOM.style.visibility = 'hidden'
        detailsDOM.style.height = '0'
      }
    }
    if (this.state.showDetails === false) {
      return e(
        'div',
        {
          className: 'extension paa-title result',
          onClick: (e) => toggleDetails(e),
        },
        [
          e('div', { className: 'extension link-title arrow-down' }, [
            e('p', {}, `People Also Ask`),
          ]),
        ]
      )
    } else {
      return e('div', { className: 'extension paa-title result' }, [
        e(
          'div',
          {
            className: 'extension link-title arrow-up',
            onClick: (e) => toggleDetails(e),
          },
          [e('p', {}, `People Also Ask`)]
        ),
        e(PAAResultsContainer, { links: this.state.links }),
      ])
    }
  }
}

class PAAResults extends React.Component {
  render() {
    const copyPAA = () => {
      const PAACheckboxes = [
        ...document.querySelectorAll('.extension.PAAcheckbox'),
      ]
      let copiedText = ''
      PAACheckboxes.map((ch) => {
        ch.checked === true &&
          (copiedText +=
            ch.parentNode.querySelectorAll('span')[2].innerText + '\n')
      })
      navigator.clipboard.writeText(copiedText)
    }
    const ifChecked = (l) => {
      if (this.state.checked.includes(l)) {
        return true
      } else {
        return false
      }
    }
    const { links } = this.props
    const resultComponents = []
    links.map((l) => {
      const { link } = l
      const question = [...document.querySelectorAll('a')].filter(
        (a) => a.href === link
      )[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode.parentNode.childNodes[0].innerText

      resultComponents.push(
        e(
          'div',
          { className: 'extension paa-result checkbox' },
          e('label', { className: 'extension' }, [
            e('input', {
              className: 'extension input-checkbox PAAcheckbox',
              type: 'checkbox',
              defaultChecked: true,
            }),
            e('span', { className: 'extension checkmark' }),
            e('span', {}, ''),
            e(
              'span',
              {
                className: 'extension PAA',
                'data-heading': 'PAA',
                'data-url': link,
              },
              [` ${question}`]
            ),
          ])
        )
      )
    })

    return e('div', { className: 'extension details' }, [
      ...resultComponents,
      e(
        'button',
        {
          onClick: () => copyPAA(),
          className: 'extension copy-btn',
        },
        [
          e(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '14',
              height: '14',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '2',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              className: 'extension svg-copy',
            },
            [
              e('rect', {
                x: '9',
                y: '9',
                width: '13',
                height: '13',
                rx: '2',
                ry: '2',
              }),
              e('path', {
                d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
              }),
            ]
          ),
          'Copy',
        ]
      ),
    ])
  }
}
class PAAResultsContainer extends React.Component {
  render() {
    return e(PAAResults, { links: this.props.links })
  }
}

ReactDOM.render(e(Container), domContainer)
