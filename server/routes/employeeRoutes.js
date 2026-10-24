const router = require("express").Router();
const c = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/me", c.getMe);
router.put("/me", c.updateMe);
router.get("/stats", authorize("HR", "Manager"), c.stats);
router.get("/", authorize("HR", "Manager"), c.list);
router.post("/", authorize("HR"), c.create);
router.put("/:id", authorize("HR"), c.update);
router.delete("/:id", authorize("HR"), c.remove);

module.exports = router;
