# postcss-hairline

[![NPM version][npm-image]][npm-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/postcss-hairline.svg?style=flat-square
[npm-url]: https://npmjs.org/package/postcss-hairline
[license-image]: https://img.shields.io/github/license/ufologist/postcss-hairline.svg
[license-url]: https://github.com/ufologist/postcss-hairline/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/postcss-hairline/blob/master/CHANGELOG.md

[![npm-image](https://nodei.co/npm/postcss-hairline.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.com/package/postcss-hairline)

PostCSS plugin for transform your border to retina [hairline](https://github.com/ufologist/hairline).

## Example

before:

```css
.foo {
    color: white;
    border: 1px solid red; /* hairline */
    border-radius: 20px; /* hairline */
}
```

after:

```css
.foo {
    color: white;
    border-radius: 10px; /* no */
    position: relative; 
}

.foo::after {
    border: 1px solid red; /* no */
    border-radius: 20px; /* no */
}

.foo::after {
    content: '';
    position: absolute;
    top: -50%;
    bottom: -50%;
    left: -50%;
    right: -50%;
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
    pointer-events: none;
}
```

## Usage

1. install plugin

   ```
   npm install --save-dev postcss-hairline
   ```

2. code `border` or `border-radius` style as usual

   ```css
   .foo {
       color: white;
       border: 1px solid red;
       border-radius: 20px;
   }
   ```

3. add `/* hairline */` comment

   ```css
   .foo {
       color: white;
       border: 1px solid red; /* hairline */
       border-radius: 20px; /* hairline */
   }
   ```

   support comment
   * `/* hairline */` default create `::after` pseudo style
   * `/* hairline-before */` specify create `::before` pseudo style
   * `/* hairline-after */` specify create `::after` pseudo style

4. use plugin

   ```
   postcss([
       require('postcss-hairline')
   ]);
   ```

   [PostCSS plugin usage](https://github.com/postcss/autoprefixer#usage)

## Options

```javascript
require('postcss-hairline')({
    pxComment: 'no'
})
```

Available options are:
* `pxComment` (string): border px unit comment. Default: `no`.

## 参考

* [postcss-retina](https://github.com/Ziphwy/postcss-retina)