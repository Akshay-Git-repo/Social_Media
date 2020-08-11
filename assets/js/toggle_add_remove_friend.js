// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleAddRemoveFriend{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'GET',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                
              


                $(self).attr('href', '/users/removefriend/');
                $(self).html(`Remove`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
