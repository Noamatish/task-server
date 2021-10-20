const { fetchEmails, createEmail, modifyClickById } = require("../services/email");

exports.getEmails = async (req, res) => {
    try {
      const emails = await fetchEmails();
      res.send(emails);
    } catch(err){
      res.status(500).send(err)
    }
  };

exports.generateEmail = async (req, res) => {
    const email = req.body;
    try {
      const createdEmail = await createEmail(email);
      res.send(createdEmail);
    } catch(err){
      res.status(500).send(err)
    }
}

exports.emailClicked = async (req, res) => {
    const { emailId } = req.body;
    try {
    await modifyClickById(emailId);
    console.log('success')
    res.send(true);
    } catch(err){
        console.log('err modify email document ', err);
        res.send(500).send('Something went wrong.');
    }
}