const nodemaler = require("nodemailer");
const path = require("path");
var hbs = require("nodemailer-express-handlebars");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SendDefaultMail = async (req, res, next) => {
  try {
    const { name, email, phone, city, message,userId } = req.body;
    if(!email||!phone||!name||!city||!message){
      return res.json({error:true,message:"Fill Required Fields."})
    }
    const user = await prisma.user.findUnique({where:{id:userId}})
    if(!user){
      return res.json({error:true,message:"User Not Registerd, Login/Register First"})
    }
    const transporter = nodemaler.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const handlebarOptions = {
      viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve("./views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views"),
      extName: ".hbs",
    };

    transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Maxisholidays",
      template: "mailTemplate",
      context: {
        name: name,
      },
    };

    const mailOptions_for_Admin = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "New Client Request for Contact",
      template: "mailTempAdmin",
      context: {
        name: name,
        email: email,
        phone: phone,
        city: city,
        message: message,
      },
    };

    await prisma.contact.create({
      data: {
        phone,
        email,
        message,
        name,
        userId,
        city
      },
    });
    const SendMailFunc = async (mailOptions) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(401).json(error);
        }
        return res.status(200).send("email sent");
      });
    };

    SendMailFunc(mailOptions);
    SendMailFunc(mailOptions_for_Admin);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = { SendDefaultMail };
