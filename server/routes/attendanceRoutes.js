const router = require("express").Router();
const c = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/check-in", c.checkIn);
router.post("/check-out", c.checkOut);
router.get("/mine", c.mine);
router.get("/", authorize("HR", "Manager"), c.list);

module.exports = router;
