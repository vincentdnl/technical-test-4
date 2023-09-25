const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const config = require("./config");
const { validatePassword } = require("./utils");

const EMAIL_OR_PASSWORD_INVALID = "EMAIL_OR_PASSWORD_INVALID";
const PASSWORD_INVALID = "PASSWORD_INVALID";
const EMAIL_AND_PASSWORD_REQUIRED = "EMAIL_AND_PASSWORD_REQUIRED";
const PASSWORD_TOKEN_EXPIRED_OR_INVALID = "PASSWORD_TOKEN_EXPIRED_OR_INVALID";
const PASSWORDS_NOT_MATCH = "PASSWORDS_NOT_MATCH";
const SERVER_ERROR = "SERVER_ERROR";
const USER_ALREADY_REGISTERED = "USER_ALREADY_REGISTERED";
const PASSWORD_NOT_VALIDATED = "PASSWORD_NOT_VALIDATED";
const ACOUNT_NOT_ACTIVATED = "ACOUNT_NOT_ACTIVATED";
const USER_NOT_EXISTS = "USER_NOT_EXISTS";

// 1 year
const COOKIE_MAX_AGE = 31557600000;
const JWT_MAX_AGE = "1y";

class Auth {
  constructor(model) {
    this.model = model;
  }

  async signin(req, res) {
    let { password, username } = req.body;
    username = (username || "").trim().toLowerCase();

    if (!username || !password) return res.status(400).send({ ok: false, code: EMAIL_AND_PASSWORD_REQUIRED });

    try {
      const user = await this.model.findOne({ name: username });
      if (!user) return res.status(401).send({ ok: false, code: USER_NOT_EXISTS });

      const match = await user.comparePassword(password);
      if (!match) return res.status(401).send({ ok: false, code: EMAIL_OR_PASSWORD_INVALID });

      user.set({ last_login_at: Date.now() });
      await user.save();

      let cookieOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
      if (config.ENVIRONMENT === "development") {
        cookieOptions = { ...cookieOptions, secure: false, domain: "localhost", sameSite: "Lax" };
      } else {
        cookieOptions = { ...cookieOptions, secure: true, domain: ".selego.co", sameSite: "Lax" };
      }

      const token = jwt.sign({ _id: user.id }, config.secret, { expiresIn: JWT_MAX_AGE });
      res.cookie("jwt", token, cookieOptions);

      return res.status(200).send({ ok: true, token, user });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async signup(req, res) {
    try {
      const { password, username, organisation } = req.body;

      if (password && !validatePassword(password)) return res.status(200).send({ ok: false, user: null, code: PASSWORD_NOT_VALIDATED });

      const user = await this.model.create({ name: username, organisation, password });
      const token = jwt.sign({ _id: user._id }, config.secret, { expiresIn: JWT_MAX_AGE });
      const opts = { maxAge: COOKIE_MAX_AGE, secure: config.ENVIRONMENT === "development" ? false : true, httpOnly: false };
      res.cookie("jwt", token, opts);

      return res.status(200).send({ user, token, ok: true });
    } catch (error) {
      console.log("e", error);
      if (error.code === 11000) return res.status(409).send({ ok: false, code: USER_ALREADY_REGISTERED });
      console.log(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("jwt");
      return res.status(200).send({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ok: false, error });
    }
  }

  async signinToken(req, res) {
    try {
      const { user } = req;
      user.set({ last_login_at: Date.now() });
      const u = await user.save();
      return res.status(200).send({ user, token: req.cookies.jwt, ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }
}

module.exports = Auth;
