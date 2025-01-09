const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const otherControllers = require("../controllers/otherControllers");
const contactController = require("../controllers/contactController");

router.get("/difusiones", otherControllers.getDifusiones);
router.get("/proyectos", otherControllers.getProyectos);

router.post("/suscribirse", otherControllers.createNewSubscriber);
router.post("/contact", contactController.sendContactMessage);

router.get("/personal", userController.getAllUsers);
router.get("/persona/:id", userController.getUserById);

router.get("/persona/:id/difusioncientifica", userController.getUserDiffusion);
router.get("/persona/:id/proyecto", userController.getUserProjects);
router.get("/persona/:id/extension", userController.getUserExtension);

router.get("/ultimasnovedades", otherControllers.getRecentPosts);

router.get("/:table", otherControllers.getAll);
router.get("/:table/describe", otherControllers.describeTable);
router.get("/:table/:id", otherControllers.getRegisterByID);

module.exports = router;
