import { Router } from "express";
import {
  getFile,
  getFolder,
  searchFilm,
  searchGoogle,
} from "../controllers/fshare";

const router = Router();

router.post("/generate", getFile);
router.post("/getFolder", getFolder);
router.post("/searchFilm", searchFilm);
router.post("/ggSearch", searchGoogle);

export default router;
