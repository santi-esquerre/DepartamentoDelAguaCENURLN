const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/persona", userController.getAllUsers);
router.get("/persona/:id", userController.getUserById);
router.post("/persona", userController.createUser);
router.put("/persona/:id", userController.updateUser);
router.delete("/persona/:id", userController.deleteUser);

router.get("/persona/:id/difusioncientifica", userController.getUserDiffusion);
router.get("/persona/:id/proyecto", userController.getUserProjects);
router.get("/persona/:id/extension", userController.getUserExtension);
router.post(
  "/persona/:id/difusioncientifica",
  userController.relateUserWithDiffusion
);
router.post("/persona/:id/proyecto", userController.relateUserWithProject);
router.post("/persona/:id/extension", userController.relateUserWithExtension);

module.exports = router;
