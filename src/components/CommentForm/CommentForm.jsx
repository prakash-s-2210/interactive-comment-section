import React, {useState} from 'react';
import "../CommentForm/CommentForm.scss";
import uuid from 'react-uuid';

const CommentForm = ({ 
  comments, 
  button, 
  replyingTo, 
  addComment, 
  updateComment, 
  toggleFormComponent, 
  id
}) => {
  const [ input, setInput ] = useState(replyingTo?`@${replyingTo} `:"");
  const handleSubmit = (e) => {
    const updatedInput = input.replace(/@\w+\s*/g,"");
    e.preventDefault();
    if(updatedInput.length === 0){
      setInput("");
      return;
    }
    if(button === "SEND"){
      const newComment = {
        "id": uuid(),
        "content": updatedInput,
        "createdAt": new Date(),
        "score": 0,
        "upVote": false,
        "user": {
          "image": { 
            "png": comments[0].currentUser.image.png,
            "webp": comments[0].currentUser.image.webp
          },
          "username": comments[0].currentUser.username
        },
        "replies": []
      }
      comments[0].comments.push(newComment);
      updateComment(comments);
      setInput("");
      toggleFormComponent(id);
    }
    else{
      const replyComment = {
        "id": uuid(),
        "content": updatedInput,
        "createdAt": new Date(),
        "score": 0,
        "upVote": false,
        "replyingTo": replyingTo,
        "user": {
          "image": { 
            "png": comments[0].currentUser.image.png,
            "webp": comments[0].currentUser.image.webp
          },
          "username": comments[0].currentUser.username
        }
      }
      const commentIndex = comments[0].comments.findIndex(comment => comment.id === addComment.id);
      if(commentIndex !== -1){
        comments[0].comments[commentIndex].replies.push(replyComment);
      }
      updateComment(comments);
      setInput("");
      toggleFormComponent(id);
    }
  }
  return (
    <form onSubmit={handleSubmit} className='form-flex-container'>
        <img src={comments[0].currentUser.image.png} alt="user-img" className="form-flex-item" />
        <textarea required 
          rows={3} 
          placeholder='Add a comment...' 
          id="myInput" 
          value={input} 
          onChange={(e)=> {setInput(e.target.value)}}  
          className="form-flex-item"  
        />
        <button type='submit' className="form-flex-item">{button}</button>
    </form>
  )
}

export default CommentForm;