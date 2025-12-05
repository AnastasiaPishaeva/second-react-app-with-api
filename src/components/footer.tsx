import { colors, Typography,} from "@mui/material";

const Footer = () => {
      return (
        <footer style={{ display: "flex",
            position: "sticky",
            top: "100vh",
            justifyContent: "flex-start", 
            alignItems: "center",
            background: "#9C968A",
            height: "150px",
            paddingLeft: "60px"}} >
            <Typography sx ={{color: "white", fontFamily: "'Montserrat', sans-serif", justifyContent :"center"}}> © 2025 Website. All rights reserved.</Typography>

        </footer>
      );
    };
    export default Footer;