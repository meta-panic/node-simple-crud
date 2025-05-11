import "dotenv/config";

import getAppArgs from "./utils/ArgParser";


const args = getAppArgs(process.argv, "mode");

if (args === "single") {
  await import("./runSingle");
} else if (args === "multi") {
  await import("./runMulti");
} else {
  console.error("Incorrect app arguments:", args);
}

// const dbService = mockDBService();
// const DB_PORT: string | undefined = process.env.DB_PORT || "1234";

// const userService = new UserService(`http://localhost:${DB_PORT}`);
// const userController = new UserController(userService);

// new App()
//   .registerRoutes(userController.routers)
//   .initDB(dbService, DB_PORT) // TODO: rename method
//   .startServer();
