import "./Footer.css";
import { typography } from "./typography";
import Linkedin from "./assets/linkedin.svg?react";
import Github from "./assets/github.svg?react";
import Gmail from "./assets/gmail.svg?react";

function Footer({ theme }) {
  const year = new Date().getFullYear();

  return (
    <div
      className="footer-container"
      style={{
        color: theme.textPrimary,
      }}
    >
      <div className="footer-container-inner">
        <div
          className="footer-section about"
          style={{ lineHeight: typography.lineHeight.tight }}
        >
          <p
            className="name"
            style={{
              fontWeight: typography.weight.light,
              fontSize: typography.size.xs,
            }}
          >
            Cynthia Monkap
          </p>
          <p className="copyright">
            {String.fromCharCode(169)} {year}
          </p>
        </div>

        <div className="footer-section connect">
          <a href="https://github.com/Cynthilizy">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/cynthia-monkap-3b3b31124/">
            <Linkedin />
          </a>
          <a href="mailto:cynthilizy@gmail.com">
            <Gmail />
          </a>
        </div>
      </div>
    </div>
  );
}
export default Footer;
