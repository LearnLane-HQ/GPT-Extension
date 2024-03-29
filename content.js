// Content.js

// Display initial message upon extension loading
console.log(
    `GPT extension loaded successfully.\n1. It's an open source project. Learn more: https://github.com/LearnLane-HQ/GPT-Extension\n2. Extension is build by Aavirbhaavks. Learn more: https://github.com/LearnLane-HQ`
  )
  
  // Add toggle button for extending/closing the sidebar
  const addToggleButton = () => {
    const toggleButton = document.createElement('button')
    toggleButton.id = 'rightSidebarToggleButton'
    toggleButton.innerHTML = `<img width='20px' src='https://raw.githubusercontent.com/abhidadhaniya23/chat-enhancer-chrome-extension/main/images/logo.png'/>`
    toggleButton.addEventListener('click', () => {
      const isSidebarExist = document.getElementById('rightSidebar')
      if (isSidebarExist) clearRightSidebar()
      else addRightSidebar()
    })
    setTimeout(() => {
      if (!document.getElementById('rightSidebarToggleButton')) {
        const form = document.querySelector('form')
        if (form) form.append(toggleButton)
      }
    }, 2000)
  }
  
  // Add or refresh the right sidebar content
  function addRightSidebar() {
    addCopyButtonForNumberList()
    const userPrompts = document.querySelectorAll(`[data-message-author-role='user']`)
    const rightSidebar = document.createElement('div')
    rightSidebar.id = 'rightSidebar'
    rightSidebar.style.cssText = `
    width: 260px;
    height: 100%;
    overflow-y: auto;
    color: #ECECF1;
    background: black !important;
    padding: 10px 8px;
    `
  
    userPrompts.forEach((prompt, index) => {
      const promptContent = prompt.querySelector('div').innerText
  
      const promptElement = document.createElement('div')
      promptElement.innerText = `${index + 1}. ${truncateText(promptContent, 60)}`
      promptElement.title = promptContent
      promptElement.style.cssText = `
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
      overflow: hidden;
      margin-bottom: 2px;
      `
  
      promptElement.addEventListener('mouseover', () => {
        promptElement.style.backgroundColor = '#202123'
      })
  
      promptElement.addEventListener('mouseout', () => {
        promptElement.style.backgroundColor = ''
      })
  
      promptElement.addEventListener('click', () => {
        prompt.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
  
      rightSidebar.appendChild(promptElement)
    })
  
    if (userPrompts.length > 0) document.querySelectorAll('div')[1].append(rightSidebar)
  
    if (!document.getElementById('rightSidebarToggleButton')) addToggleButton()
  }
  
  function addCopyButtonForNumberList() {
    let isApplicable = true
    const ol = document.querySelectorAll('.markdown ol')
  
    if (ol.length > 0) {
      ol.forEach((item) => {
        const copyButton = document.createElement('button')
        copyButton.classList.add('copyButton')
        copyButton.innerText = 'Copy List'
        copyButton.style.marginTop = '12px'
        copyButton.style.background = '#404040'
        copyButton.style.padding = '0px 8px'
        copyButton.style.borderRadius = '5px'
        copyButton.style.width = 'fit-content'
        copyButton.style.color = 'white'
        copyButton.onclick = () => {
          let text2Copy = ''
          item.childNodes.forEach((list, i) => {
            if (i === item.childNodes.length - 1) return
            const text = list.querySelector('strong').innerText
            const listItem = text.endsWith(':') ? text.slice(0, text.length - 1) : list.querySelector('strong').innerText
            return (text2Copy += `${i + 1}. ${listItem}\n`)
          })
  
          navigator.clipboard.writeText(text2Copy)
          copyButton.innerText = 'Copied'
          setTimeout(() => {
            copyButton.innerText = 'Copy List'
          }, 2000)
        }
  
        item.childNodes.forEach((list, i) => {
          if (!list.querySelector('strong')) isApplicable = false
        })
  
        if (item.querySelector('.copyButton')) isApplicable = false
        if (isApplicable) item.append(copyButton)
        isApplicable = true
      })
    }
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'clearRightSidebar') {
      clearRightSidebar()
      clearToggleButton()
    }
  })
  
  // Function to clear existing right sidebar content
  function clearRightSidebar() {
    const existingSidebar = document.getElementById('rightSidebar')
    if (existingSidebar) {
      existingSidebar.remove()
    }
  }
  
  function clearToggleButton() {
    const existingToggleButton = document.getElementById('rightSidebarToggleButton')
    if (existingToggleButton) existingToggleButton.remove()
  }
  
  // Function to handle URL change and trigger right sidebar update
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateRightSidebar') {
      clearRightSidebar()
      addRightSidebar()
    }
  })
  
  // Function to truncate text to a specified length
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }
  