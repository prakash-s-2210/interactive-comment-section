import React, {useState} from 'react';
import "../Comment/Comment.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faReply, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const Comment = ({
    user, 
    comment, 
    toggleFormComponent, 
    editComment, 
    comments, 
    updateComment,
    toggleModel
}) => {
    const [showEditForm, setShowEditForm ] = useState(false);
    const [ editInput, setEditInput ] = useState(editComment.replies.length === 0 ? `${comment.content}` : `@${comment.replyingTo} ${comment.content}`)
    function toggleEditForm(){
        setShowEditForm(!showEditForm);
    }
    function handleDelete(){
        if(editComment.replies.length === 0){
            const updatedComments = comments[0].comments.filter((comment)=>comment.id!==editComment.id);
            const updatedData = [
                ...comments.slice(0, 0),
                {
                  ...comments[0],
                  comments: updatedComments,
                },
              ]; 
            toggleModel(updatedData);
        }
        else{
            const commentIndex = comments[0].comments.findIndex((comment) => comment.id === editComment.id);
            const updatedComments = comments[0].comments[commentIndex].replies.filter((reply)=>reply.id!==comment.id);
            let updatedData = JSON.parse(JSON.stringify(comments))
            updatedData[0].comments[commentIndex].replies = updatedComments; 
            toggleModel(updatedData);
        } 
    }
    function handleUpdateComment(){
        const updatedInput = editInput.replace(/@\w+\s*/g,"");
        if(updatedInput === "" ){
            return;
        }
        if(editComment.replies.length === 0){
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            if(commentIndex !== -1){
                comments[0].comments[commentIndex].createdAt = new Date();
                comments[0].comments[commentIndex].content = updatedInput;
                updateComment(comments);
                setShowEditForm(!showEditForm)
            }
        }
        else{
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            const replyIndex = comments[0].comments[commentIndex].replies.findIndex(reply => reply.id === comment.id);
            if(commentIndex !== -1 && replyIndex !== -1 ){
                comments[0].comments[commentIndex].replies[replyIndex].createdAt = new Date();
                comments[0].comments[commentIndex].replies[replyIndex].content = updatedInput;
                updateComment(comments);
                setShowEditForm(!showEditForm)
            }
        }
    }
    function getTimeStamp(createdAt){
        const date = new Date(createdAt);
        const now = new Date();
        const diffSeconds = Math.round((now - date) / 1000);
        if (diffSeconds < 60) {
            return `${diffSeconds} seconds ago`;
        }
        const diffMinutes = Math.round(diffSeconds / 60);
        if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        }
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) {
            return `${diffHours} hours ago`;
        }
        const diffDays = Math.round(diffHours / 24);
            return `${diffDays} days ago`;
    }
    function handleReply(){
        toggleFormComponent(comment.id);
    }


    function handleLike(){
        if(comment.upVote){
            return
        }
        else if(editComment.replies.length === 0){
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            if(commentIndex !== -1){
                comments[0].comments[commentIndex].score = comment.score+1;
                comments[0].comments[commentIndex].upVote = true;
                updateComment(comments);
            }
        }
        else if(comments[0].comments.findIndex(a => a.id === comment.id) !== -1){
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
                comments[0].comments[commentIndex].score = comment.score+1;
                comments[0].comments[commentIndex].upVote = true;
                updateComment(comments);
        }
        else{
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            const replyIndex = comments[0].comments[commentIndex].replies.findIndex(reply => reply.id === comment.id);
            if(commentIndex !== -1 && replyIndex !== -1 ){
                comments[0].comments[commentIndex].replies[replyIndex].score = comment.score+1;
                comments[0].comments[commentIndex].replies[replyIndex].upVote = true;
                updateComment(comments);
            }
        }
    }

    function handleDislike(){
        if(!comment.upVote){
            return
        }
        else if(editComment.replies.length === 0){
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            if(commentIndex !== -1){
                comments[0].comments[commentIndex].score = comment.score-1;
                comments[0].comments[commentIndex].upVote = false;
                updateComment(comments);
            }
        }
        else if(comments[0].comments.findIndex(a => a.id === comment.id) !== -1){
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
                comments[0].comments[commentIndex].score = comment.score-1;
                comments[0].comments[commentIndex].upVote = false;
                updateComment(comments);
        }
        else{
            const commentIndex = comments[0].comments.findIndex(comment => comment.id === editComment.id);
            const replyIndex = comments[0].comments[commentIndex].replies.findIndex(reply => reply.id === comment.id);
            if(commentIndex !== -1 && replyIndex !== -1 ){
                comments[0].comments[commentIndex].replies[replyIndex].score = comment.score-1;
                comments[0].comments[commentIndex].replies[replyIndex].upVote = false;
                updateComment(comments);
            }
        }
    }

  return (
    <div className='flex-container'>
        <div className='flex-item comment-score-flex'>
            <div className = {`${comment.upVote ? 'plus-icon-disabled' : 'plus-icon-enabled'}`} onClick={handleLike}><FontAwesomeIcon icon = {faPlus} /></div>
            <span className = {`${comment.upVote ? 'score-active' : 'score-inActive'}`}>{comment.score}</span>
            <div onClick={handleDislike} className = {`${comment.upVote ? 'minus-icon-enabled' : 'minus-icon-disabled'}`}><FontAwesomeIcon icon = {faMinus}  /></div>
        </div>
        <div className='flex-item comment-detail-flex'>
            <div className='comment-header-flex'>
                <div className='user-information'>
                    <img src={comment.user.image.png} alt="" className='user-image'/>
                    <span className='user-name'>{comment.user.username}</span>
                    {user === comment.user.username  && <span className='user-account'>you</span>}
                    <span className='comment-created'>{getTimeStamp(comment.createdAt)}</span>
                </div>
                {user === comment.user.username ?
                <div className='update-content-container'>
                    <div className='delete-wrapper-flex' onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} className='delete-icon' />
                        <span className='delete-text'>Delete</span>
                    </div>
                    <div className='edit-wrapper-flex' onClick={toggleEditForm}>
                        <FontAwesomeIcon icon={faPen} className='edit-icon' />
                        <span className='edit-text'>Edit</span>
                    </div>
                </div>:
                <div className='reply-wrapper-flex' onClick={handleReply}>
                    <FontAwesomeIcon icon={faReply} className='reply-icon' />
                    <span className='reply-text'>Reply</span>
                </div> 
                }
            </div>
            {showEditForm ? 
            <textarea rows = {4} className='edit-form-conatiner'value = {editInput} onChange={(e) => setEditInput(e.target.value)}  required /> : 
            <div className='content'>
                <span style={{color:"hsl(238, 40%, 52%)"}}>
                    {`${comment.replyingTo?`@${comment.replyingTo} `:""}`}
                </span>{comment.content}
            </div>}
            {showEditForm && (user === comment.user.username && <div className='update-btn-flex' onClick={handleUpdateComment}><button className='update-btn'>UPDATE</button></div>)}
        </div>
    </div>
  )
}

export default Comment
