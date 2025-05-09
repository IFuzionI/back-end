// const express = require("express");
// const mongoose = require("mongoose");
// const routes = require("./routes/routes");
// const app = express();

// // Middleware de CORS
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "HEAD, GET, POST, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // JSON Parser
// app.use(express.json());

// // Rota básica pra testar se está no ar
// app.get("/", (req, res) => {
//   res.send("API está no ar!");
// });

// // Rotas principais
// app.use("/api", routes);

// // Porta padrão
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server Started at ${PORT}`);
// });

// // Conexão com MongoDB
// const mongoURL = process.env.MONGO_DB || process.argv[2];
// if (!mongoURL) {
//   console.error("Nenhuma URL do MongoDB foi fornecida!");
//   process.exit(1);
// }

// mongoose.connect(mongoURL);
// mongoose.Promise = global.Promise;

// const db = mongoose.connection;
// db.on("error", (error) => {
//   console.log("Erro ao conectar no MongoDB:", error);
// });
// db.once("connected", () => {
//   console.log("✅ Database Connected");
// });

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const app = express();

// Middleware de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "HEAD, GET, POST, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// JSON Parser
app.use(express.json());

// Rota básica
app.get("/", (req, res) => {
  res.send("API está no ar!");
});

// Rotas principais
app.use("/api", routes);

// MongoDB URI via env ou argumento
const mongoURL = process.env.MONGO_DB || process.argv[2];
if (!mongoURL) {
  console.error("❌ Nenhuma URL do MongoDB foi fornecida!");
  process.exit(1);
}

// Conectar ao MongoDB
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("✅ Database Connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server Started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  });