const app = require('../app');
port = 4001

if (typeof app.express.locals === 'undefined') {
  app.express.locals = {};
}

// When BE is running locally, override cookie params (sameSite YES, secure NO).
app.express.locals.getCookieParams = function(loginSession) {
  return {
    maxAge: loginSession.max_age*1000,
    httpOnly: true,
    secure: false,
    sameSite: true
  };
}

app.express.listen(port, () => {
  console.log(`Back-end lambda service listening at http://localhost:${port}`)
})
