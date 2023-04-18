import React from "react";
import CommentList from "./components/CommentList/CommentList";
import "../src/components/CommentList/CommentList.scss"

function App() {
  // const [ comments, setComments ] = useState(JSON.parse(localStorage.getItem("comments")) || [data]);
  
  

  return (
    <div className="App">
      <CommentList />
    </div>
  );
}

export default App;
