import express from "express";

import repositoryRoutes from "./repository.js";

const router = express.Router({ mergeParams: true });

router.use("/repository", repositoryRoutes);

export default router;
