const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "HEAD, GET, POST, PATCH, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, id-token"
  );
  next();
});

// JSON Parser
app.use(express.json());

// Rota básica pra testar se está no ar
app.get("/", (req, res) => {
  res.send("API está no ar!");
});

// Rotas principais
app.use("/api", routes);
app.use("/api/users", userRoutes);

// Porta padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

// Conexão com MongoDB
const mongoURL =
  "mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0";
if (!mongoURL) {
  console.error("Nenhuma URL do MongoDB foi fornecida!");
  process.exit(1);
}

mongoose.connect(mongoURL);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", (error) => {
  console.log("Erro ao conectar no MongoDB:", error);
});
db.once("connected", () => {
  console.log("✅ Database Connected");
});
