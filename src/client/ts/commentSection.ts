// variables
const videoContainer = document.getElementById(
  "videoContainer"
) as HTMLDivElement;
const form = document.getElementById("commentForm") as HTMLFormElement;
let del_btns = document.querySelectorAll(
  ".del_comment"
) as NodeListOf<HTMLElement>;

/**
 * Add comment on screen func (to show it real-time)
 * @param {comment content} text
 * @param {comment id} id
 */
const addComment = (text: string, id: string) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  span.classList.add("comment-context");
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "del_comment";
  span2.addEventListener("click", handleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments!.prepend(newComment);
};

/**
 * Deleting comment on screen func (to show it real-time
 * @param {comment id} id
 */
const deleteComment = (id: string) => {
  const comment = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
  comment.parentNode && comment.parentNode.removeChild(comment);
};

/**
 * Posting comment func fro DB using custom api.
 * @param {click add btn event} event
 */
const handleSubmit = async (event: SubmitEvent) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea") as HTMLTextAreaElement;
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

/**
 * Deleting comment func from DB using custom api.
 * @param {click delete btn event} event
 */
const handleDelete = async (event: Event) => {
  const comment_id = ((event.target as HTMLElement).parentNode as HTMLElement)
    .dataset.id;
  const response = await fetch(`/api/comments/${comment_id}/delete`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    comment_id && deleteComment(comment_id);
  }
};

// add eventlistener to each delete btn
del_btns.forEach((del_btn) => {
  del_btn.addEventListener("click", handleDelete);
});
form && form.addEventListener("submit", handleSubmit);

export {};
