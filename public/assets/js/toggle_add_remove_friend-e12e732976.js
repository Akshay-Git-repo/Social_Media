class ToggleAddRemoveFriend{constructor(e){this.toggler=e,this.toggleLike()}toggleLike(){$(this.toggler).click((function(e){e.preventDefault();let t=this;$.ajax({type:"GET",url:$(t).attr("href")}).done((function(e){$(t).attr("href","/users/removefriend/"),$(t).html("Remove")})).fail((function(e){console.log("error in completing the request")}))}))}}