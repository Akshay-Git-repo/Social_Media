
 {   

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
                    // call the create comment class
                    new PostComments(data.data.post._id);

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
                        <small>
                        ${ data.data.user_info }
                        </small>

                        
                        <small>
                            <a class="delete-post-button"  href="/post/destroy/${ data.data.post._id }">Delete</a>
                        </small>
                        <small style="margin-left: 20vw;  id="post_created_time"">${data.data.post.createdAt}</small>
                        
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





// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each,
// also add AJAX (using the class we've created) to the delete button of each

let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        console.log(postId);
        new PostComments(postId);
    });
}

convertPostsToAjax();
createPost();

                   

}