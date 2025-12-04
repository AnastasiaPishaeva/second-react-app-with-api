import { Link, useLocation} from "react-router-dom";
import { styled } from '@mui/material/styles';

const StyledHeader = styled("header")`
  background-color: white;
  display: flex;
  justify-content : flex-end;
  padding: 20px;
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const StyledNav = styled("nav")`
  display: flex;
  padding: 0 120px;
  @media (max-width: 900px) {
    padding: 0 60px;
  }
`;

const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(( {isActive} ) => ({
  position: "relative",
  color: "#121212",
  fontFamily: "'Montserrat', sans-serif",
  display: "flex",
  textDecoration: "none",
  fontWeight: isActive ? "600" : "400",

  "&::after": {
    content: '""',
    position: "absolute",
    left: isActive ? "0" : "50%",
    bottom: "-1em",
    width: isActive ? "100%" : "0",
    height: "3px",
    background: "#676565ff",
    transition: "width 0.5s ease, left 0.5s ease",
  }
}));

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1] || "";;
  return (
    <StyledHeader >
      <StyledNav>
        <StyledLink style = {{marginRight: 55}} to="/" isActive={currentPath === ""}>MeowFacts</StyledLink>
        <StyledLink  style = {{marginRight: 55}} to="/memes" isActive={currentPath === "memes"}>Memes</StyledLink>
        <StyledLink to="/books" isActive={currentPath === "books"}>Books</StyledLink>
      </StyledNav>
    </StyledHeader>
  );  
};

export default Header;
