const express = require("express");
const router = express.Router();
const formController = require("../controllers/formControllerLatest");

// Serve the form
router.get("/", formController.getForm);

// Preview the PDF
router.post("/preview-pdf", formController.previewPdf);

// Generate PDF endpoint
router.post("/generate-pdf", formController.generatePdf);

module.exports = router;
