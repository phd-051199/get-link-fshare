import app from "./app";
import { fsConfig, PORT } from "./config";
import { login } from "./controllers/fshare";

const main = async () => {
  try {
    app.listen(PORT);
    await login({ user_email: fsConfig.email, password: fsConfig.password });
    console.info(`Server on http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
  }
};

main();
