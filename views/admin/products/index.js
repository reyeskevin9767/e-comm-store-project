const layout = require('../layout');

//* HTML For Products List
module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      return `
    <div>${product.title}</div>
    `;
    }).join('');

  return layout({
    content: `
    <h1 class="title">Products</h1>
    ${renderedProducts}
    `,
  });
};
