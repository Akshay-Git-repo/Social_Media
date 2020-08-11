
 {   
    console.log("HI I AM AKSHAY");
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/post/create',
                data: newPostForm.serialize(),
                success: function(data){
                    
                    let newPost = newPostDom(data);
                   
                    console.log(newPost);
                    
                    $('#posts-list-container>ul').prepend(newPost);
                    
                    deletePost($(' .delete-post-button', newPost));
                    // likePost($(' .like-post-button', newPost));
                    // call the create comment class
                    new PostComments(data.data.post._id);
                          // CHANGE :: enable the functionality of the toggle like button on the new post
                          new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();



                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }



    // method to create a post in DOM
    let newPostDom = function(data){
        return $(`<li id="post-${data.data.post._id}">
                    <p id="post-content">
                        
                       
                        ${ data.data.post.content }
                        <br>
                        <small style="color: blue;font-weight:bolder;">
                        ${ data.data.user_info }
                        </small>

                        
                        <small>
                            <a class="delete-post-button"  href="/post/destroy/${ data.data.post._id }">Delete</a>
                        </small>
                        <small style="margin-left: 20vw;  id="post_created_time"">${data.data.post.createdAt}</small>
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${data.data.post._id}&type=Post">
                                    0 Likes
                                </a>

                    </p>
                    <div class="post-comments">
                        
                            <form action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type Here to add comment..." required>
                                <input type="hidden" name="post" value="${ data.data.post._id }" >
                                <input type="submit" value="Add Comment">
                            </form>
               
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${ data.data.post._id }">
                                
                            </ul>
                        </div>
                    </div>
                    
                </li>`)
    }

  

 // method to delete a post from DOM
 let deletePost = function(deleteLink){
  
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                console.log(data)
                $(`#post-${data.data.post_id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "Post Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

              
            },error: function(error){
                console.log(error.responseText);
            }
        });

    });


    }


     // method to like a post
//  let likePost = function(likeLink){
//   console.log('inside likepost',likeLink);
//     $(likeLink).click(function(e){
//         e.preventDefault();

//         $.ajax({
//             type: 'get',
//             url: $(likeLink).prop('href'),
//             success: function(data){
                
//                // $(`#post-${data.data.type_id}`).replaceWith(data.data.count,'Likes');
//             //    $(likeLink).innerHTML=`${data.data.count} Likes`;
//             $(`a#${data.data.type_id}.like-post-button`).text(`${data.data.count} Likes`);
                
             
              
//             },error: function(error){
//                 console.log(error.responseText);
//             }
//         });

//     });


//     }







// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each,
// also add AJAX (using the class we've created) to the delete button of each

let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);
        
        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
       
        new PostComments(postId);
    });
}

convertPostsToAjax();
createPost();

                   

}