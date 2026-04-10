const dotenv = require("dotenv");
const app = require("./src/app");

dotenv.config();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
