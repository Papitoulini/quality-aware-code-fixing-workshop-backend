import express from "express";

import eventRoutes from "./events.js";

const router = express.Router({ mergeParams: true });

router.use("/events/", eventRoutes);

export default router;
