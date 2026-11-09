const fs = require('fs');

const headerPath = 'client/src/components/Header.jsx';
let content = fs.readFileSync(headerPath, 'utf8');

// Replace GAMING_MENU_COLUMNS and STREAMING_MENU_COLUMNS
const oldMegaMenusRegex = /\/\/ Exact Gaming Mega Menu[\s\S]*?const STREAMING_MENU_COLUMNS = \[[\s\S]*?\];/;

const newMegaMenus = `// Exact Gaming Mega Menu featuring authorized partner brands
const GAMING_MENU_COLUMNS = [
  {
    top: {
      title: 'Gaming Mouse',
      items: [
        'Wired Mice (All Brands)',
        'Dell Wired Mouse',
        'Logitech Optical Mouse',
        'HP Optical Mouse',
        'Zebronics Wired Mouse',
        'Lapcare Optical Mouse',
        'ProDot Total Control Mouse',
        'Geonix Optical Mouse',
        'Consistent Optical Mouse',
        'iBall Optical Mouse',
        'Acer Desktop Mouse',
        'TVS Champ Heavy Duty Mouse',
        'Ant Esports Gaming Mouse',
        'Cosmic Byte Gaming Mouse',
        'Wireless Gaming Mouse'
      ]
    },
    bottom: {
      title: 'Gaming PC',
      items: [
        'AAA Gaming PC',
        'Casual Gaming PC',
        'Esports Gaming PC',
        'View All'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Keyboard',
      items: [
        'Wired Keyboards (All Brands)',
        'TVS Gold Mechanical Keyboard',
        'TVS Champ Wired Keyboard',
        'Dell Wired Keyboard',
        'HP Wired Keyboard',
        'Logitech Wired Keyboard',
        'Zebronics Wired Keyboard',
        'Lapcare Multimedia Keyboard',
        'ProDot Wired Keyboard',
        'Consistent Wired Keyboard',
        'Geonix Wired Keyboard',
        'iBall Wired Keyboard',
        'Acer Wired Keyboard',
        'Ant Esports Gaming Keyboard',
        'Cosmic Byte Mechanical Keyboard'
      ]
    },
    bottom: {
      title: 'Gaming Chair',
      items: [
        'Ant Esports Gaming Chair',
        'Zebronics Gaming Chair',
        'View All'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Headphones',
      items: [
        'Wired Gaming Headphones',
        'Wireless Gaming Headphones',
        'Zebronics Gaming Headphones',
        'Logitech Gaming Headphones',
        'Ant Esports Gaming Headphones',
        'Cosmic Byte Gaming Headphones',
        'Lapcare Gaming Headphones',
        'Lenovo Legion Headphones',
        'HP Gaming Headphones',
        'iBall Stereo Headphones'
      ]
    },
    bottom: {
      title: 'Controllers / Gamepad',
      items: [
        'Wired Controllers',
        'Wireless Controllers',
        'Cosmic Byte Controllers',
        'Ant Esports Controllers',
        'Logitech Gamepad',
        'Zebronics Gamepad'
      ]
    }
  },
  {
    top: {
      title: 'Gaming Mousepad',
      items: [
        'Popular : Medium Mousepad',
        'Popular : Large Mousepad',
        'Zebronics Gaming Mousepad',
        'Ant Esports Gaming Mousepad',
        'Cosmic Byte Gaming Mousepad',
        'Lapcare Gaming Mousepad',
        'ProDot Gaming Mousepad'
      ]
    },
    bottom: null
  }
];

// Exact Streaming Mega Menu featuring authorized partner brands
const STREAMING_MENU_COLUMNS = [
  {
    title: 'Webcam',
    items: [
      'Zebronics Webcam',
      'Logitech Webcam',
      'Lapcare HD Webcam',
      'HP Full HD Webcam',
      'Lenovo FHD Webcam',
      'Dell Pro Webcam',
      'iBall Face2Face Webcam',
      'View All'
    ]
  },
  {
    title: 'Microphones',
    items: [
      'Ant Esports Microphone',
      'Zebronics Microphone',
      'Cosmic Byte Microphone',
      'Logitech Microphone',
      'View All'
    ]
  },
  {
    title: 'Streaming Gear',
    items: [
      'Ant Esports Streaming Gear',
      'Zebronics Streaming Gear',
      'Cosmic Byte Gaming Gear',
      'Lapcare Streaming Accessories',
      'View All'
    ]
  },
  {
    title: 'Gaming & Streaming PC',
    items: [
      'Esports Gaming PC',
      'Casual Gaming PC',
      'AAA Gaming PC',
      'View All'
    ]
  }
];`;

content = content.replace(oldMegaMenusRegex, newMegaMenus);

// Also replace Elgato in handleMegaItemClick if present
content = content.replace(
  `} else if (groupTitle === 'Elgato') {`,
  `} else if (groupTitle === 'Streaming Gear' || groupTitle === 'Elgato') {`
);

fs.writeFileSync(headerPath, content, 'utf8');
console.log('✓ Header.jsx updated successfully.');
