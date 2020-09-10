if(navigator.onLine)
{

    console.log(window.location.pathname);

    $(document).ready(function(){

        function checkLogin() {
            if(sessionStorage.getItem("authorization")){
                window.location.pathname = "batch-production-frontend/html/user_cooling.html";
            }
         }
      
         checkLogin();

        $(".form-login").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "LOGIN_API_ENDPOINT_URL"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "username": $('#inputUsername').val(),
                    "password": $('#inputPassword').val()
                }),
                statusCode :{
                   200: function() {
                        console.log("success");
                   }
                }
                ,
                contentType:"application/json; charset=utf-8",
                success: function(data, textStatus, jqXHR)
                {
                    console.log($('#inputUsername').val());
                    console.log($('#inputPassword').val());

                    if(textStatus == "success"){
                        // sessionStorage.setItem("authorization" , data.authorization);
                        // window.location.pathname = "Bhojan-App/html/menu.html";
                    }
                },
                error: function (e)
                {
                    console.log(e);
                }
            });
        });
    
    });
}
else
{
    alert('You are Offline')
}
