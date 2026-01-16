import express from "express";
import {
  getBannerById,
  getBanners,
} from "../../../controllers/public/banner/bannerControllerPublic";

const router = express.Router();

router.get("/banner", getBanners);

router.get("/banner/:id", getBannerById);

export default router;
