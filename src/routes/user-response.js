import Sentry from "@sentry/node";
import express from "express";

import { models } from "#dbs";

const { UserResponse, Question } = models;
const router = express.Router({ mergeParams: true });

const groupAndShortAnswers = (userResponses) => {
     const questionsMap = {};

     for (const ur of userResponses) {
       const qidx  = ur.question.index;
       const email = ur.user.email;
     
       // init question bucket
       if (!questionsMap[qidx]) questionsMap[qidx] = {};
     
       // init user bucket
       if (!questionsMap[qidx][email]) {
         questionsMap[qidx][email] = {
           user: { email: ur.user.email, username: ur.user.fullname },
           personalFixes: []
         };
       }
     
       // push this snippet into that user’s personalFixes
       questionsMap[qidx][email].personalFixes.push({
         index:   ur.snippet.index,
         code:    ur.snippet.code,
         findings: ur.analysis
       });
     }
     
     // 3) Transform map → array, sort everything
     return Object.entries(questionsMap).map(([qidx, usersMap]) => {
     
       // build the fixes array for this question
       const fixes = Object.values(usersMap).map(u => {
         // sort this user’s personalFixes by fewest→most findings
         u.personalFixes.sort((a, b) => a.findings.length - b.findings.length);
         // record their “best” (minimum) findings-count for user-level sorting
         u.leastFindings = u.personalFixes[0].findings.length;
         return u;
       });
     
       // sort users by their best snippet’s findings count (fewest→most)
       fixes.sort((a, b) => a.leastFindings - b.leastFindings);
     
       return {
         question: Number(qidx),
         fixes
       };
     });
}

router.get("/", async (req, res) => {
	try {

        const userResponses = await UserResponse.find()
        .populate({ path: "question", select: "index" })
        .populate({ path: "snippet",  select: "code" })
        .populate({ path: "user",     select: "email fullname" });
        if (userResponses.length === 0) return res.json({ success: false, message: "No Fixes Found" });
      
        const result = groupAndShortAnswers(userResponses);

		return res.json({ success: true, data: result });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

router.get("/:index", async (req, res) => {
	try {
		const { index } = req.params;
        const idx = Number(index);
        const questionDoc = await Question.findOne({ index: idx }).select("_id");
        if (!questionDoc) return res.json({ success: false, message: "No Questions Found" });
        const userResponses = await UserResponse.find({ question: questionDoc._id})
        .populate({ path: "question", select: "index" })
        .populate({ path: "snippet",  select: "code" })
        .populate({ path: "user",     select: "email fullname" });
        if (userResponses.length === 0) return res.json({ success: false, message: "No Fixes Found" });

        const result = groupAndShortAnswers(userResponses);

		return res.json({ success: true, data: result });
	} catch (error) {
		Sentry.captureException(error);
		return res.json({ success: false, message: "Something Went Wrong" });
	}
});

export default router;
