// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleWow{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleWow();
    }


    toggleWow(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'GET',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let wowCount = parseInt($(self).attr('data-wow'));
                let total_likes;
                let total_like_query="total-likes-"+data.data.post_id;
                total_likes=parseInt($(`#${total_like_query}`).attr('data-total-likes'));
                if (data.data.deleted == true){
			if(data.data.model_diff==false){
                    wowCount -= 1;
                    total_likes -=1;
                    }
                    if(data.data.model_diff==true)
                    {
                        wowCount += 1;
                        
                        let query="post-"+data.data.model+"-"+data.data.post_id;
                        let count;
                        console.log("query is",query)
                        if(data.data.model=="like")
                        {
                            count = parseInt($(`#${query}`).attr('data-likes'));
                            if(count!=0){
                            count -=1;
                            }
                            $(`#${query}`).html(`${count} Likes`)
                        }
                        else{
                        count = parseInt($(`#${query}`).attr('data-'+data.data.model));
                        if(count!=0)
                        {
                        count -=1;
                        }
                        $(`#${query}`).html(`<i class="fas fa-heart" style="color: red;">&nbsp${count} Love</i>`);
                        }
                       
                    }
                                       
                }else{ 
                    wowCount += 1;
                    total_likes +=1;
                }
                

                $(self).attr('data-wow', wowCount);
                $(`#${total_like_query}`).html(`${total_likes} Likes`)             
                $(self).html(`<i class="fas fa-surprise" style="color: yellowgreen;">&nbsp${wowCount} Wow</i>`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
