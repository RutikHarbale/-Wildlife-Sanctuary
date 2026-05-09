/* ============================================
   EXTRAS: Language Switcher & Chatbot JS
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     LANGUAGE SWITCHER
     ============================================ */
  const langSwitcher = document.getElementById('langSwitcher');
  const langBtn      = document.getElementById('langBtn');
  const langLabel    = document.getElementById('langLabel');
  const langOptions  = document.querySelectorAll('.lang-option');

  // Translations dictionary
  const translations = {
    en: {
      'nav.donate': 'Donate Now',
      'chat.name': 'WildBot',
      'chat.status': 'Online'
    },
    hi: {
      'nav.donate': 'दान करें',
      'chat.name': 'वाइल्डबॉट',
      'chat.status': 'ऑनलाइन'
    },
    mr: {
      'nav.donate': 'दान करा',
      'chat.name': 'वाइल्डबॉट',
      'chat.status': 'ऑनलाइन'
    },
    ta: {
      'nav.donate': 'நன்கொடை',
      'chat.name': 'வைல்ட்பாட்',
      'chat.status': 'ஆன்லைனில்'
    }
  };

  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (langSwitcher) langSwitcher.classList.remove('open');
  });

  if (langSwitcher) {
    langSwitcher.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      
      // Update active state
      langOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Update button label (e.g. EN, HI)
      if (langLabel) {
        langLabel.textContent = lang.toUpperCase();
      }
      
      // Update text in UI
      const t = translations[lang] || translations['en'];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
          el.textContent = t[key];
        }
      });
      
      // Close dropdown
      if (langSwitcher) langSwitcher.classList.remove('open');
    });
  });

  /* ============================================
     CHATBOT WIDGET
     ============================================ */
  const chatbot         = document.getElementById('chatbot');
  const chatbotToggle   = document.getElementById('chatbotToggle');
  const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
  const chatbotBadge    = document.getElementById('chatbotBadge');
  const chatbotInput    = document.getElementById('chatbotInput');
  const chatbotSend     = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotQuick    = document.getElementById('chatbotQuick');

  // Simple bot logic
  const botResponses = [
    { keywords: ['hi', 'hello', 'hey'], response: "Hello there! How can I help you with Widelife Sanctuary today?" },
    { keywords: ['ticket', 'book', 'price'], response: "You can book tickets in our 'Tickets & Passes' section. Adults are ₹800, Children ₹400, and Safari passes are ₹1,500." },
    { keywords: ['time', 'hour', 'open'], response: "The sanctuary is open from 6:00 AM to 6:00 PM every day." },
    { keywords: ['animal', 'tiger', 'elephant'], response: "We protect over 12,000 acres of forest! You might see tigers, elephants, deer, and many colorful birds." },
    { keywords: ['donate', 'help'], response: "Every rupee helps! You can donate by clicking the 'Donate Now' button in the navigation bar." },
    { keywords: ['location', 'where', 'map'], response: "We are located in the Western Ghats forest reserve near Sakleshpur, Karnataka. Check the Map section for directions!" }
  ];

  const quickReplies = [
    "Ticket Prices",
    "Opening Hours",
    "What animals can I see?",
    "How to donate?"
  ];

  let chatOpenedBefore = false;

  function toggleChat() {
    if (!chatbot) return;
    const isOpen = chatbot.classList.contains('open');
    if (!isOpen) {
      chatbot.classList.add('open');
      if (chatbotBadge) chatbotBadge.classList.add('hidden');
      if (!chatOpenedBefore) {
        chatOpenedBefore = true;
        // initial message
        setTimeout(() => {
          addMessage('bot', "Hi! I'm WildBot 🐾 Welcome to Widelife Sanctuary. How can I assist you today?");
          showQuickReplies();
        }, 300);
      }
      setTimeout(() => {
        if (chatbotInput) chatbotInput.focus();
      }, 400);
    } else {
      chatbot.classList.remove('open');
    }
  }

  if (chatbotToggle)   chatbotToggle.addEventListener('click', toggleChat);
  if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', toggleChat);

  function addMessage(sender, text) {
    if (!chatbotMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    if (sender === 'bot') {
      msgDiv.innerHTML = `<span class="chat-sender">WildBot</span>${text}`;
    } else {
      msgDiv.textContent = text;
    }
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function showTyping() {
    if (!chatbotMessages) return null;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
  }

  function handleUserInput(text) {
    if (!text.trim()) return;
    
    // Add user message
    addMessage('user', text);
    if (chatbotInput) chatbotInput.value = '';
    
    // Hide quick replies
    if (chatbotQuick) chatbotQuick.innerHTML = '';
    
    // Show typing indicator
    const typing = showTyping();
    
    // Process response
    setTimeout(() => {
      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
      
      const lowerText = text.toLowerCase();
      let response = "I'm not sure about that. Try asking about tickets, timings, animals, or donations!";
      
      for (const rule of botResponses) {
        if (rule.keywords.some(kw => lowerText.includes(kw))) {
          response = rule.response;
          break;
        }
      }
      
      addMessage('bot', response);
      showQuickReplies();
    }, 1000 + Math.random() * 500);
  }

  function showQuickReplies() {
    if (!chatbotQuick) return;
    chatbotQuick.innerHTML = '';
    quickReplies.forEach(qr => {
      const btn = document.createElement('button');
      btn.className = 'quick-btn';
      btn.textContent = qr;
      btn.addEventListener('click', () => {
        handleUserInput(qr);
      });
      chatbotQuick.appendChild(btn);
    });
  }

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', () => {
      handleUserInput(chatbotInput.value);
    });
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserInput(chatbotInput.value);
    });
  }

});
