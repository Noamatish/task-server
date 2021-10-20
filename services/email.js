const Email = require("../models/email");
const { to } = require("../utils");
const nodemailer = require("nodemailer");

//Service function for getting all emails. Would've also added pagination for better quering and performance.
exports.fetchEmails = async () => {
    const [err, emails] = await to(Email.find().lean());
    if(err){
      throw new Error("Error fetching emails");
    };
    return emails;
};

exports.createEmail = async (email) => {
  try {
    const createdEmail = await Email.create(email);
    const urlHash = createdEmail._id + '___' +  Math.floor( Math.random() * 10000 ) + 1
    createdEmail.url =  'localhost:3000/phishing/' + urlHash;
    await createdEmail.save();
    const { url, email: sender, body } = createdEmail;
    this.sendEmail({url, body, email: sender});
    return createdEmail;
  } catch (error) {
    console.log("error updating email", error);
    throw new Error("Could not update email");
  }
};

exports.modifyClickById = async (emailId) => {
    let [err, clickedEmail] = await to(Email.findById(emailId));
    if(err){
        throw new Error("Error updating email click");
    };
    clickedEmail.clicked = true;
    await clickedEmail.save();
    return true;
}

exports.sendEmail = async ({url,body ,email}) => {
    let text;
    let subject = "Please look at our brand-new Landing page!";
    let to = email;
    text =
    "<!DOCTYPE html>" +
    "<html><head><title>Appointment</title>" +
    '</head><body><div style="direction: ltr;">' +
    "<h4>New landing page!</h4>" +
    "<p>"+
    body +
    "</p>"+
    `<p>Please visit the next link: <a href="${url}">Landing</a></p>` +
    "<p>Thank you.</p>" +
    "</div></body></html>";
    var smtpTransport = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 25,
        service: "Outlook365",
        secure: true,
        auth: {
          user: process.env.EMAIlL_USERNAME,
          pass: process.env.EMAIlL_PASSWORD,
        },
    });
    var mailOptions = {
        to: 'noamatish@gmail.com',
        from: "noam@atishkin.com",
        subject: subject,
        html: text,
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
            console.log('err sending email ', err);            
        } else console.log('email sent')
      });
}
