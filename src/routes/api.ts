import { Router } from "express";
import {
  autoCompleteFilm,
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
router.get("/ac", autoCompleteFilm);

export default router;
