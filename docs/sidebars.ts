import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Core Components',
      items: [
        'components/category-list',
        'components/comment-section',
        'components/community-feed',
        'components/create-post-form',
        'components/filter-tabs',
        'components/footer',
        'components/home-nav',
        'components/location',
        'components/navbar',
        'components/post-card',
        'components/post-detail',
        'components/sidebar',
      ],
    },
    {
      type: 'category',
      label: 'Pages Components',
      items: [
        'pages/calender',
        'pages/chat',
        'pages/chat-interface',
        'pages/community-feed',
        'pages/create-post-form',
        'pages/hero',
        'pages/market-insights',
        'pages/scheme',
        'pages/services',
        'pages/weather',
      ],
    },
    {
      type: 'category',
      label: 'API Documentation',
      items: [
        'api/cal',
        'api/community',
        'api/farming-advice',
        'api/geocode',
        'api/response',
        'api/schemes',
        'api/weather',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
