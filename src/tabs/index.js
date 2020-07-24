import './styles.sass';

const handleInnerHTML = (root, navContainer, contentContainer) => {
  NodeList.prototype.forEach = Array.prototype.forEach;
  NodeList.prototype.find = Array.prototype.find;

  // create decorator for active tab
  const decorator = document.createElement('div');
  decorator.classList.add('tab-nav_decorator');

  // add class to root element
  root.classList.add('tab-wrapper');

  // add class to root element, append decorator element, add class to children
  navContainer.classList.add('tab-nav');
  const navContainerChildren = navContainer.childNodes;
  navContainerChildren.forEach((node, index) => {
    node.classList.add('tab-nav_link');
    if (!node.dataset.tabName) {
      node.dataset.tabName = `tab-${index + 1}`;
    }
  });
  navContainer.append(decorator);

  // take and content container element children and append them into
  // special created element with class 'tab-switch'
  const contentContainerChildren = contentContainer.childNodes;
  const tabSwitchContainer = document.createElement('div');
  tabSwitchContainer.classList.add('tab-switch');
  contentContainerChildren.forEach((node, index) => {
    const cloned = node.cloneNode(true);
    cloned.classList.add('tab-item');
    console.log(cloned);
    if (!cloned.dataset.tabName) {
      cloned.dataset.tabName = `tab-${index + 1}`;
    }
    tabSwitchContainer.appendChild(cloned);
  });

  // add class to content container element, append switch tab container into content container
  contentContainer.classList.add('tab-container');
  contentContainer.innerHTML = '';
  contentContainer.append(tabSwitchContainer);
};

export class Tabs {
  currentTabContentPosition = 0;
  decoratorOffset;

  constructor(
    {
      rootSelector,
      navContainerSelector,
      contentContainerSelector,
    },
    options
  ) {
    this.$root = document.querySelector(rootSelector);
    this.$navContainer = this.$root.querySelector(navContainerSelector);
    this.$contentContainer = this.$root.querySelector(contentContainerSelector);

    this.options = options;
    this.currentTab = options.defaultTab;

    this.selectTab = this.selectTab.bind(this);

    this.#render();
    this.#setup();
  }

  #render() {
    const { $root, $navContainer, $contentContainer } = this;
    handleInnerHTML($root, $navContainer, $contentContainer);
  }

  #setup() {
    this.$navTabs = document.querySelectorAll('.tab-nav_link');
    this.$navTabs.forEach(item => item.addEventListener('click', this.selectTab));
    this.$slideContainer = document.querySelector('.tab-switch');
    this.$tabItems = this.$slideContainer.querySelectorAll('.tab-item');
    this.$decorator = document.querySelector('.tab-nav_decorator');
    this.selectDefaultTab();
  }

  get currentSelected() {
    return this.currentTab;
  }

  selectDefaultTab() {
    const tab = this.$navTabs.find(item => item.dataset.tabName === this.currentSelected);
    this.selectTabContent(this.currentSelected);
    this.finActiveItemParams(tab);
  }

  selectTab({ target }) {
    const { tabName } = target.dataset;
    this.selectTabContent(tabName);
    this.finActiveItemParams(target);
  }

  selectTabContent(tab) {
    const { $tabItems, $contentContainer } = this;
    $tabItems.forEach(item => {
      if (item.dataset.tabName === tab) {
        let coords = item.getBoundingClientRect();
        if (coords.left < 0) {
          this.currentTabContentPosition += -coords.left + $contentContainer.offsetLeft;
        } else {
          this.currentTabContentPosition -= coords.left - $contentContainer.offsetLeft;
        }
        this.$slideContainer.style.transform = `translateX(${this.currentTabContentPosition}px)`;
      }
    });
  }

  finActiveItemParams(tab) {
    const activeItemWidth = tab.offsetWidth;
    this.decoratorOffset = tab.offsetLeft;

    this.$decorator.style.width = `${activeItemWidth}px`;
    this.$decorator.style.transform = `translateX(${this.decoratorOffset}px)`;
  }
}
