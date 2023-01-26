import { Router } from "express";
import { index } from "../controllers/fshare";

const router = Router();

router.get("/", index);

export default router;
