import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import userRouter from "./routes/user.routes";
import patientRouter from "./routes/patient.routes";
import healthRouter from "./routes/health.routes";
import { graphqlHandler } from "./graphql";
import { createServer } from "http";
import { webSocket } from "./graphql/websocket";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", userRouter);
app.use("/api/patients", patientRouter);
app.use("/api/health", healthRouter);

app.use(errorHandler);

app.use("/graphql", graphqlHandler);

const httpServer = createServer(app);
webSocket(httpServer);

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
