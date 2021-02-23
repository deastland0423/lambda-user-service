const app = require('../app');
port = 4001

app.express.listen(port, () => {
  console.log(`Back-end lambda service listening at http://localhost:${port}`)
})
