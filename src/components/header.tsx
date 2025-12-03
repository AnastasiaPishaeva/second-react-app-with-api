import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header style = {{backgroundColor: "white",
        marginBottom : 3,
        display: "flex",
        justifyContent : "flex-end"}}>

      <nav style = {{display: "flex"}}>
        <Link style = {{marginRight: 6, textDecoration: "none", 
            color: "#121212"
         }} to="/">MeowFacts</Link>
        <Link  style = {{marginRight: 6, textDecoration: "none",
            color: "#121212"
          }} to="/memes">Memes</Link>
        <Link  style = {{marginRight: 6, textDecoration: "none",
          color: "#121212"
        }} to="/books">Books</Link>
      </nav>
    </header>
  );  
};

export default Header;
