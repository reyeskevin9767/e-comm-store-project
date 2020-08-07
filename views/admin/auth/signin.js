//* Basic html layout
const layout = require('../layout');

//* HTML of signin
module.exports = () => {
  return layout({
    content: `
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name= "password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>  
  `,
  });
};
