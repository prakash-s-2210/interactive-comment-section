import React, {useState, useEffect} from "react";
import { data } from "../../data";
import "../CommentList/CommentList.scss";
import CommentForm from "../CommentForm/CommentForm";
import Comment from "../Comment/Comment";


const CommentList = () => {
  const [ comments, setComments ] = useState(JSON.parse(localStorage.getItem("comments")) || [data]);
  const [ showModel, setShowModel ] = useState(false);
  const [showFormComponent, setShowFormComponent ] = useState([]);
  const [updatedComments, setUpdatedComments ] = useState(comments);

  
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  },[comments])

  // show Model 
  const toggleModel = (filteredComments) => {
    console.log("filteredComments", filteredComments)
    setUpdatedComments(filteredComments);
    console.log("toggleModel",updatedComments)
    setShowModel(!showModel);
  }

  // delete comment 

  const handleDelete = () => {
    console.log("handleDelete", updatedComments)
    setComments((prevState) => [...updatedComments]);
    setShowModel(!showModel);
  }

  // show form component 
  const toggleFormComponent = (commentId) => {
    setShowFormComponent((prevState) => {
    const index = prevState.indexOf(commentId);
    if (index === -1) {
      return [...prevState, commentId];
    } 
    else {
      return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
    }
    });
    }

  // add comment 
  function updateComment(comments){
    setComments((prevState) => [...comments]);
  }
    return(
      <div className="main-wrapper">
        {showModel && <div className="model-container">
          <div className="model-wrapper" >
            <div className="delete-comment">Delete comment</div>
            <span className="delete-confirmation-content">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</span>
            <div className="model-btn-wrapper">
              <button className="cancel-btn" onClick={()=> {
                setShowModel(false);
              }}>NO, CANCEL</button>
              <button className="delete-btn" onClick={handleDelete}>YES, DELETE</button>
            </div>
          </div>
        </div>}
        <div className="comment-container">
        {comments[0].comments.sort((a,b) => b.score - a.score)
        .map((comment)=> (
            <React.Fragment key={comment.id}>
                <Comment user = {comments[0].currentUser.username}  comment = {comment} toggleFormComponent = {toggleFormComponent} editComment = {comment} comments = {comments} updateComment={updateComment} toggleModel = {toggleModel}/>
                {showFormComponent.includes(comment.id) && <CommentForm  comments = {comments} button = {"REPLY"} replyingTo = {comment.user.username}  addComment={comment} updateComment = {updateComment} toggleFormComponent = {toggleFormComponent} id = {comment.id} />}
                <div className= 'reply-container'>
                  <div className= {`${comment.replies.length !== 0 ? 'reply-alignment':''}`}></div>
                  <div className="reply-wrapper">
                    {comment.replies.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map((reply) => 
                    <div key = {reply.id}>
                      <Comment user = {comments[0].currentUser.username} comment = {reply} toggleFormComponent = {toggleFormComponent} editComment = {comment}  comments = {comments} updateComment={updateComment} toggleModel = {toggleModel} />
                      {showFormComponent.includes(reply.id) && <CommentForm comments = {comments} button = {"REPLY"} replyingTo={reply.user.username} addComment = {comment} updateComment = {updateComment} toggleFormComponent = {toggleFormComponent} id = {reply.id} />}
                    </div>
                    )}
                  </div>
                </div> 
            </React.Fragment>   
        ))}
        <div style={{marginTop: "15px"}}><CommentForm comments= {comments} button = {"SEND"} replyingTo={""} addComment={comments} updateComment = {updateComment} toggleFormComponent = {toggleFormComponent}  /></div>
        </div>
      </div>
    );
}
export default CommentList;