document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('CustomMobileNav');
  if (!nav) return;

  const originalMenuTrigger = document.querySelector('.burger-js');
  if (originalMenuTrigger) {
    const cleanMenuTrigger = originalMenuTrigger.cloneNode(true);
    originalMenuTrigger.parentNode.replaceChild(cleanMenuTrigger, originalMenuTrigger);
    
    cleanMenuTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openNav();
    });
  }

  let parentCategoryRedirectUrl = null;
  let navigationHistory = [];

  const closeBtn = nav.querySelector('.custom-mobile-nav__close-btn');
  const backBtn = nav.querySelector('.custom-mobile-nav__back-btn');
  const navTitle = nav.querySelector('.custom-mobile-nav__title');
  const tabs = nav.querySelectorAll('.custom-mobile-nav__tab-btn');
  const panels = nav.querySelectorAll('.custom-mobile-nav__panel');
  const level1 = nav.querySelector('[data-level="1"]');
  const level2 = nav.querySelector('[data-level="2"]');
  const level2Content = nav.querySelector('.custom-mobile-nav__submenu-content');

  function setActiveTabBasedOnURL() {
    const currentPath = window.location.pathname;
    let activeTabHandle = 'men';

    if (currentPath.includes('/collections/women') || currentPath.includes('/pages/women')) {
      activeTabHandle = 'women';
    } else if (currentPath.includes('/collections/11-11-sale') || currentPath.includes('/collections/sale')) {
      activeTabHandle = '11-11-sale';
    } else if (currentPath === '/') {
      activeTabHandle = 'men';
    }
    
    const activeTab = nav.querySelector(`.custom-mobile-nav__tab-btn[data-menu-handle="${activeTabHandle}"]`);
    if (activeTab) {
      activeTab.click();
    } else if (tabs.length > 0) {
      tabs[0].click();
    }
  }

  function openNav() {
    parentCategoryRedirectUrl = null;
    showLevel1();
    nav.classList.add('is-open');
    document.body.classList.add('custom-nav-open');
    setActiveTabBasedOnURL();
  }

  function closeNav() {
    if (parentCategoryRedirectUrl) {
      window.location.href = parentCategoryRedirectUrl;
      return;
    }
    nav.classList.add('is-closing');
    nav.classList.remove('is-open');
    setTimeout(() => {
      nav.classList.remove('is-closing');
      document.body.classList.remove('custom-nav-open');
    }, 300);
  }

  function showLevel1() {
    navigationHistory = [];
    level2.style.display = 'none';
    level1.style.display = 'block';
    backBtn.style.display = 'none';
    navTitle.textContent = '';
    navTitle.style.cursor = 'default';
    navTitle.dataset.url = '';
  }

  function renderLevel(content, title, url) {
    level2Content.innerHTML = '';
    const contentToDisplay = content.cloneNode(true);
    contentToDisplay.style.display = 'block';
    level2Content.appendChild(contentToDisplay);
    
    navTitle.textContent = title;
    navTitle.style.cursor = 'pointer';
    navTitle.dataset.url = url; 

    level1.style.display = 'none';
    level2.style.display = 'block';
    backBtn.style.display = 'block';
  }

  function goBack() {
    navigationHistory.pop();
    if (navigationHistory.length > 0) {
      const previousLevel = navigationHistory[navigationHistory.length - 1];
      renderLevel(previousLevel.content, previousLevel.title, previousLevel.url);
    } else {
      showLevel1();
    }
  }

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeNav();
  });

  backBtn.addEventListener('click', goBack);
  navTitle.addEventListener('click', () => { if (navTitle.dataset.url) window.location.href = navTitle.dataset.url; });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showLevel1();
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = nav.querySelector(`.custom-mobile-nav__panel[data-menu-handle="${tab.dataset.menuHandle}"]`);
      if (panel) {
        panel.classList.add('active');

        switch (tab.dataset.menuHandle) {
          case 'men':
            parentCategoryRedirectUrl = '/';
            break;
          case 'women':
            parentCategoryRedirectUrl = '/collections/women';
            break;
          case '11-11-sale':
          case 'sale':
            parentCategoryRedirectUrl = '/collections/11-11-sale';
            break;
          default:
            parentCategoryRedirectUrl = null;
        }
      }
    });
  });
  
  nav.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;

    e.preventDefault();
    parentCategoryRedirectUrl = null;

    if (targetLink.hasAttribute('data-has-submenu')) {
      const submenuContainer = targetLink.nextElementSibling;
      if (submenuContainer && submenuContainer.classList.contains('custom-mobile-nav__submenu-data')) {
        const title = targetLink.dataset.title || targetLink.textContent.trim();
        const url = targetLink.href;
        const content = submenuContainer;

        if (navigationHistory.length === 0) {
          const topLevelPanel = targetLink.closest('.custom-mobile-nav__panel');
          navigationHistory.push({ content: topLevelPanel, title: 'Main', url: '' });
        }
        
        navigationHistory.push({ content, title, url });
        renderLevel(content, title, url);
      }
    } else {
      window.location.href = targetLink.href;
    }
  });
});