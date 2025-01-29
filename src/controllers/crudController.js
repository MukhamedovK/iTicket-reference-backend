const crudCreator = (Model, options = {}) => {
  const {
    useLang = false,
    useImages = false,
    imageFields = [],
    imageFolder = "",
    populateFields = [],
  } = options;
  const { languageConverter } = require("../services/langConverter");
  const deleteFile = require("../services/deleteFile");
  const imageUrlCreator = require("../services/imageUrlCreator");

  return {
    getAll: async (req, res) => {
      try {
        const lang = useLang ? req.query.lang : null;
        const query = Model.find();
        if (populateFields) query.populate(populateFields);
        const items = await query;
        const localizedItems = useLang
          ? items.map((item) => languageConverter(item.toObject(), lang))
          : items;
        res.status(200).json(localizedItems);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    },

    getOne: async (req, res) => {
      try {
        const lang = useLang ? req.query.lang : null;
        const query = Model.findById(req.params.id);
        if (populateFields) query.populate(populateFields);
        const item = await query;
        if (!item) return res.status(404).json({ message: "Not found" });
        const localizedItem = useLang
          ? languageConverter(item.toObject(), lang)
          : item;
        res.status(200).json(localizedItem);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    },

    create: async (req, res) => {
      try {
        let images = {};
        if (useImages) {
          imageFields.forEach((field) => {
            if (req.files?.[field]) {
              const imageUrls = Array.isArray(req.files[field])
                ? req.files[field].map((file) =>
                    imageUrlCreator(file.filename, imageFolder)
                  )
                : [imageUrlCreator(req.files[field][0].filename, imageFolder)];

              images[field] = imageUrls.length === 1 ? imageUrls[0] : imageUrls;
            }
          });
        }

        const newItem = await Model.create({ ...req.body, ...images });
        res.status(201).json(newItem);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    },

    update: async (req, res) => {
      try {
        let images = {};
        if (useImages) {
          imageFields.forEach((field) => {
            if (req.files?.[field]) {
              const imageUrls = Array.isArray(req.files[field])
                ? req.files[field].map((file) =>
                    imageUrlCreator(file.filename, imageFolder)
                  )
                : [imageUrlCreator(req.files[field][0].filename, imageFolder)];

              images[field] = imageUrls.length === 1 ? imageUrls[0] : imageUrls;
            }
          });
        }

        const query = Model.findByIdAndUpdate(
          req.params.id,
          { ...req.body, ...images },
          { new: true }
        );
        if (populateFields) query.populate(populateFields);
        const updatedItem = await query;

        if (!updatedItem) return res.status(404).json({ message: "Not found" });
        res.status(200).json(updatedItem);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    },

    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });

        if (useImages) {
          imageFields.forEach((field) => {
            if (item[field]) {
              if (Array.isArray(item[field])) {
                item[field].forEach((filePath) => deleteFile(filePath));
              } else {
                deleteFile(item[field]);
              }
            }
          });
        }

        res.status(200).json({ message: "Deleted successfully" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
  };
};

module.exports = { crudCreator };
