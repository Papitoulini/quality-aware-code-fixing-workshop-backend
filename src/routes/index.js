import express from "express";

import repositoryRoutes from "./repository.js";

const router = express.Router({ mergeParams: true });

import publicRoutes from "./public.js";
import llmsRoutes from "./llms.js";
import qualityRoutes from "./quality.js";
import questionRoutes from "./question.js";
import questionnaireRoutes from "./questionnaire.js";
import quolyRoutes from "./quoly.js";
import userRoutes from "./user.js";

// import { attachUser } from "#middleware";

router.use("/", publicRoutes);

// router.use(attachUser);

router.use("/repositories", repositoryRoutes);
router.use("/llms/", llmsRoutes);
router.use("/quality/", qualityRoutes);
router.use("/question/", questionRoutes);
router.use("/questionnaire/", questionnaireRoutes);
router.use("/quoly/", quolyRoutes);
router.use("/user/", userRoutes);

export default router;
