const db = require("../../../config/db");
const passwordUtils = require("../../../utils/password")
const issueJwt = require("../../../utils/issueJwt")

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //login
    let user = await db.collection("users").where("email", "==", email).limit(1).get()

    if(user.empty)
    {
        res.code = 401
        next(new Error("Invalid email or password"))
    }

    user = { id:user.docs[0].id,...user.docs[0].data()}

    if(passwordUtils.isValid(password, user.hash, user.salt))
    {
        const issuedJwt = issueJwt(user)
        res.status(200).json({success:true, data:{user:user, jwt:issuedJwt}, message:"Successful login"})
    }else{
        res.code = 401
        next(new Error("Invalid email or password"))
    }

    //reponse
  } catch (error) {
    next(error);
  }
};
