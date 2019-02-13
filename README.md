# plants

- plant gallery (per user & general)
- species autocomplete
- update profile
- update plant
- delete plant
- delete profile

* error.hbs
* not-found.hbs
* species-list.hbs
* contact.hbs
* sources.hbs

- layout.hbs >>contact.hbs >>sources.hbs

- index.hbs (login)
  (if logged-in) >> /auth-views/user-profile.hbs

  > > /species-views/species-list.hbs
  > > /auth-views/signup-form.hbs

- /auth-views/signup-form.hbs
  (if signed-up) >> index.hbs

- user-profile.hbs
  excerpt>>user-edit.hbs
  excerpt>>plant-list.hbs
  excerpt>>wish-list.hbs

- plant-list.hbs
  > > /plant-views/plant-details.hbs
  > > ++/plant-add>>plant-form.hbs
  > > ++/:plantId/delete>>plant-list.hbs

* plant-details
  ++/plant-views/plant-edit.hbs

- wish-list.hbs
  ++/species/add
  ++/species/delete
