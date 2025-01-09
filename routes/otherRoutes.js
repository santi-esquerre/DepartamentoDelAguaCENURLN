const express = require("express");
const router = express.Router();
const otherControllers = require("../controllers/otherControllers");
const contactController = require("../controllers/contactController");

router.get("/:table", otherControllers.getAll);
router.get("/describe/:table", otherControllers.describeTable);
router.post("/difusioncientifica", otherControllers.createNewDiffusion);
router.post("/proyecto", otherControllers.createNewProject);
router.post("/extension", otherControllers.createNewExtension);
router.put("/difusioncientifica/:id", otherControllers.updateDiffusion);
router.put("/proyecto/:id", otherControllers.updateProject);
router.put("/extension/:id", otherControllers.updateExtension);
router.delete("/delete/:table/:id", otherControllers.deleteRegister);
router.post("/notify", contactController.sendContactMessage);

module.exports = router;
