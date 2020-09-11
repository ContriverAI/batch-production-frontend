if(navigator.onLine)
{

    console.log(window.location.pathname);

    $(document).ready(function(){

        function checkLogin() {
            if(sessionStorage.getItem("designation") === "user" && sessionStorage.getItem("role") === "cooling"){
                window.location.pathname = "/user_cooling";
            }
            else if(sessionStorage.getItem("designation") === "user" && sessionStorage.getItem("role") === "store"){
                window.location.pathname = "/user_store";
            }
            else if(sessionStorage.getItem("designation") === "user" && sessionStorage.getItem("role") === "production"){
                window.location.pathname = "/user_production";
            }
            else if(sessionStorage.getItem("designation") === "supervisor" && sessionStorage.getItem("role") === "cooling"){
                window.location.pathname = "/superviser_cooling";
            }
            else if(sessionStorage.getItem("designation") === "supervisor" && sessionStorage.getItem("role") === "store"){
                window.location.pathname = "/superviser_store";
            }
            else if(sessionStorage.getItem("designation") === "supervisor" && sessionStorage.getItem("role") === "production"){
                window.location.pathname = "/superviser_production";
            }
            else if(sessionStorage.getItem("designation") === "admin" && sessionStorage.getItem("role") === "system"){
                window.location.pathname = "/admin";
            }
         }
      
         checkLogin();

        $(".form-login").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/users"
            document.getElementById("loadingText").style.display = "inline";

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

                    if( data.designation && data.username && data.role){
                        console.log(data);
                        sessionStorage.setItem("username" , data.username);
                        sessionStorage.setItem("designation" , data.designation);
                        sessionStorage.setItem("role" , data.role);
                    }
                    else{
                        console.log(data);
                        document.getElementById("loadingText").innerHTML = "Incorrect Username or Password";
                        document.getElementById("loadingText").style.display = "inline";
                    }

                    if(data.role === "system" && data.designation === "admin"){
                        window.location.pathname = '/admin'
                    }

                    if(data.role === "cooling" && data.designation === "user"){
                        window.location.pathname = '/user_cooling'
                    }

                    if(data.role === "production" && data.designation === "user"){
                        window.location.pathname = '/user_production'
                    }

                    if(data.role === "store" && data.designation === "user"){
                        window.location.pathname = '/user_store'
                    }

                    if(data.role === "cooling" && data.designation === "superviser"){
                        window.location.pathname = '/superviser_cooling'
                    }

                    if(data.role === "production" && data.designation === "user"){
                        window.location.pathname = '/superviser_production'
                    }

                    if(data.role === "store" && data.designation === "user"){
                        window.location.pathname = '/superviser_store'
                    }

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
