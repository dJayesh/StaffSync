const router = require("express").Router();
const c = require("../controllers/trainingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", c.list);
router.post("/", authorize("Manager"), c.create);
router.delete("/:id", authorize("Manager", "HR"), c.remove);

module.exports = router;
