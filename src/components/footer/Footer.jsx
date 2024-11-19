import { ArrowUpCircleFill } from "react-bootstrap-icons";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <div>
      <div className="footer-container">
        <div>
          <Link className="logo" to='/'>
            <h2> The VUB Hub </h2>
          </Link>
        </div>
        <p> &copy;2024 Tariq | Sellamzi | King </p>
        <div>
          <Link onClick={scrollToTop}> <ArrowUpCircleFill size={30} color="black"/> </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
