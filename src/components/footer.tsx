import { Typography,} from "@mui/material";

const Footer = () => {
      return (
        <footer style={{ display: "flex",
            position: "sticky",
            top: "100vh",
            justifyContent: "flex-start", 
            alignItems: "center",
            background: "#9C968A",
            minHeight: "150px",
            paddingLeft: "60px",
            marginTop: "30px",}} >
            <Typography sx ={{color: "white", fontFamily: "'Montserrat', sans-serif", justifyContent :"center"}}> © 2025 Website. All rights reserved.</Typography>

        </footer>
      );
    };
    export default Footer;