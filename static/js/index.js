if(navigator.onLine)
{

    console.log(window.location.pathname);

    $(document).ready(function(){

        var current = null;
        document.querySelector('#username').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
            value: 0,
            duration: 700,
            easing: 'easeOutQuart'
            },
            strokeDasharray: {
            value: '240 1386',
            duration: 700,
            easing: 'easeOutQuart'
            }
        });
        });
        document.querySelector('#password').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
            value: -336,
            duration: 700,
            easing: 'easeOutQuart'
            },
            strokeDasharray: {
            value: '240 1386',
            duration: 700,
            easing: 'easeOutQuart'
            }
        });
        });
        document.querySelector('#submit').addEventListener('focus', function(e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
            value: -730,
            duration: 700,
            easing: 'easeOutQuart'
            },
            strokeDasharray: {
            value: '530 1386',
            duration: 700,
            easing: 'easeOutQuart'
            }
        });
        });

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

        $("#submit").click(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/users";
            document.getElementById("loadingText").style.display = "inline";

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "username": $('#username').val(),
                    "password": $('#password').val()
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

                    if( data.designation && data.username && data.role){
                        console.log(data);
                        sessionStorage.setItem("username" , data.username);
                        sessionStorage.setItem("designation" , data.designation);
                        sessionStorage.setItem("role" , data.role);
                        sessionStorage.setItem("ukey" , data.u_key);
                    }
                    else{
                        console.log(data);
                        document.getElementById("loadingText").style.display = "none";
                        alert("Incorrect Username or Password...")
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

                    if(data.role === "cooling" && data.designation === "supervisor"){
                        window.location.pathname = '/superviser_cooling'
                    }

                    if(data.role === "production" && data.designation === "supervisor"){
                        window.location.pathname = '/superviser_production'
                    }

                    if(data.role === "store" && data.designation === "supervisor"){
                        window.location.pathname = '/superviser_store'
                    }

                    if(textStatus == "success"){
                        // sessionStorage.setItem("authorization" , data.authorization);
                        // window.location.pathname = "Bhojan-App/html/menu.html";
                    }
                },
                error: function (e)
                {
                    alert("Incorrect Username or Password...")
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
