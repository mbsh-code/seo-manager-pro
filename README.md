# SEO Manager Pro

[![NPM Version](https://img.shields.io/npm/v/seo-manager-pro.svg)](https://www.npmjs.com/package/seo-manager-pro)  

A powerful SEO Manager for Angular, React, Vue, and Vanilla JS projects.  
Easily set meta tags, Open Graph tags, Schema.org structured data, canonical URLs, robots meta, and more!

---

## Installation

```bash
npm install seo-manager-pro

```

or

```bash
yarn add seo-manager-pro
```

---

## Usage

```typescript
import { SeoManagerPro } from 'seo-manager-pro';

SeoManagerPro.updateSeo({
  title: 'Home Page',
  description: 'Welcome to the best site!',
  image: 'https://example.com/image.jpg',
  canonicalUrl: 'https://example.com/home',
  robots: 'index,follow',
  schema: [
    {
      type: 'Product',
      data: {
        name: 'iPhone 15',
        description: 'The best smartphone ever.',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        priceCurrency: 'USD'
      }
    },
    {
      type: 'FAQPage',
      data: {
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is it waterproof?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, it has IP68 rating.'
            }
          }
        ]
      }
    }
  ],
  customMetaTags: [
    { name: 'author', content: 'BestShop' },
    { name: 'keywords', content: 'iphone, smartphone, apple' }
  ]
});
```

---

## Supported Schema Types

| Type      | Description                     |
|-----------|---------------------------------|
| Product   | For product pages                |
| FAQPage   | For FAQ sections                 |
| Article   | For blog or news articles        |

---

## License

MIT
```typescript
Features
✅ SEO Meta Tags
✅ Open Graph Tags
✅ Canonical Link Management
✅ Robots Meta Tag
✅ Dynamic Schema.org Injection
✅ Works with Angular, React, Vue, and Vanilla JS
✅ CommonJS and ESM Compatible
✅ Lightweight and Blazing Fast


