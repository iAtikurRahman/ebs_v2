const form = require('../../model/form');
const form_options = require('../../model/form_options');
const form_options_response = require('../../model/form_options_response');
const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

// -------------------------------------------------------------------------------------------------------
const insertWithpost_type = async (req, res) => {
  try {
    const { caption, updated_by, post_id, purpose, is_deleted } = req.body;

    // Generate a common UID for post_type and event_feed_post
    const uid = uuidv4();
    const uid1 = uuidv4();

    // Insert into post_type
    await db.execute('INSERT INTO post_type (uid, caption, updated_by, updated_at) VALUES (?, ?, ?, ?)', [
      uid,
      caption || null,
      updated_by,
      new Date(),
    ]);

    const newForm = new form({
      id: 1, //i predifined the function auto increment
      uid: uid1,
      type: uid, // post_type uid here
      post_id: post_id,
      caption: caption,
      purpose: purpose,
      is_deleted: is_deleted || false,
      updated_by: updated_by,
      // additional fields as needed
    });

    try {
      // Save the new form to the database
      const createdForm = await newForm.save();

      res.status(201).json(createdForm);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
      return; // Return here to prevent sending another response below
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// -------------------------------------------------------------------------------------------------------

// CREATE a new form
const formCreate = async (req, res) => {
  // Generate a random string (UUID)
  const uid1 = uuidv4();
  try {
    // Create a new form instance with data from the request body
    const newForm = new form({
      id: req.body.id,
      uid: uid1,
      type: req.body.type, // posttype uid here
      post_id: req.body.post_id,
      caption: req.body.caption,
      purpose: req.body.purpose,
      is_deleted: req.body.is_deleted || false,
      updated_by: req.body.updated_by,
      // additional fields as needed
    });

    try {
      // Save the new form to the database
    const createdForm = await newForm.save();

    res.status(201).json(createdForm);
    return;
    } catch (error) {
    console.error(error);
    res.status(500).json(error);
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific record by ID
const formIdAll = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      const records = await form.find({ id: id });
      if (!records || records.length === 0) {
        return res.status(404).json({ error: 'form not found' });
      }
      const formid = records[0].uid;
      const formOption = await form_options.find({ form_id: formid }).exec();
      const formOptionsResponse = await form_options_response.find({ form_id: formid }).exec();

      // Construct the response object with records, formOption, and formOptionRespose
      const response = {
        form: records,
        formOptionBody: [],
      };

      // Iterate through formOption and match with formOptionsResponse based on uid
      formOption.forEach((option) => {
        const matchingResponses = formOptionsResponse.filter(
          (responseItem) => responseItem.form_question_id === option.uid
        );

        response.formOptionBody.push({
          formOption: option,
          formOptionResponses: matchingResponses,
        });
      });

      res.status(200).json(response);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Id cant get from params' });
  }
};




const formAll = async (req, res) => {
  try {
    const allForms = await form.find();
    res.json(allForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ all forms with all data
const formAllAll = async (req, res) => {
  try {
    const allForms = await form.find()

    res.json(allForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ a particular form by ID with all data
const formOneAll = async (req, res) => {
  try {
    const formId = req.params.formId;

    // Fetch the form by ID along with its related options and responses
    const form = await form.findById(formId)

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    console.log("hello friends");

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// UPDATE a particular form by ID
const formUpdate = async (req, res) => {
  try {
    const formId = req.params.formId;
    const { caption, ...data } = req.body;

    const formData = await form.findById(formId);
    if (!formData) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Use parameterized query to prevent SQL injection
    await db.query('UPDATE post_type p SET caption = ? WHERE p.uid = ?', [caption, formData.type]);

    const updatedForm = await form.findByIdAndUpdate(formId, { caption, ...data }, { new: true });
    
    res.status(201).json({ success: true, message: 'Form updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// DELETE a particular form by ID
const formDeleteAll = async (req, res) => {
  try {
    const formId = req.params.formId;

    // Delete related data in the "form_options" model
    await form_options.deleteMany({ form_id: formId });

    // Delete related data in the "form_options_response" model
    await form_options_response.deleteMany({ form_id: formId });

    // Delete the form
    await form.findByIdAndDelete(formId);

    res.json({ message: 'Form and related data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {insertWithpost_type,formCreate,formIdAll,formAll,formUpdate,formDeleteAll,formAllAll,formOneAll};
