// update a plant
router.post(
  "/plant/:plantId/process-edit",
  fileUploader.single("pictureUpload"),
  (req, res, next) => {
    // res.json(req.body);
    const originalDoc
    const { plantId } = req.params;
    const { plantName, plantDescription, plantSpecies, host } = req.body;
    console.log("File upload is ALWAYS in req.file OR req.files", req.file);
    
    Plant.findById(plantId)
         .then(plantDoc => {
           originalDoc = plantDoc;
         })
         .catch(err => next(err));

    if (req.file) {
      const plantPicUrl = req.file.secure_url;
    } else {
      const plantPicUrl = oringalDoc.plantPicUrl;
    }

    Plant.findByIdAndUpdate(
      plantId, // ID of the document we want to update
      {
        $set: { plantName, plantDescription, plantSpecies, plantPicUrl, host }
      }, // changes to make to that document
      { runValidators: true } // additional settings (enforce the rules)
    )
      .then(plantDoc => {
        // ALWAYS redirect if it's successful to avoid DUPLICATE DATE on refresh
        // redirect ONLY to ADDRESSES - not HBS files
        res.redirect(`/plant/${plantDoc._id}`);
      })
      // next(err) skips to the error handler in "bin/www" (error.hbs)
      .catch(err => next(err));
  }
);
