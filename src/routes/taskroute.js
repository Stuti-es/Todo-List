import express from "express";
import { getdata,createtask ,updatetask,deletetask} from "../controllers/taskcontroller.js";
import authentication from "../middleware/authuser.js";

const router = express.Router();

router.get("/getdata",authentication,getdata);
router.post("/create", authentication, createtask);
router.put("/update/:id",authentication,updatetask);
router.delete("/delete/:id",authentication,deletetask);

export default router;
