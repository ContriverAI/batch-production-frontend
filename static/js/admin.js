if(navigator.onLine)
{
    $(document).ready(function(){

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "admin") && !(sessionStorage.getItem("role") === "system")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         $("#Logout").click(function(event){
            event.preventDefault();
            sessionStorage.clear();
            window.location.pathname = "/";
         });

        
        $(".form-cooling-main").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/users"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "date": $('#input_main_date').val(),
                    "trolleyNo": $('#input_main_trolley').val(),
                    "product": $('#input_main_product').val(),
                    "shiftProduced": $('#input_main_shift_produced').val(),
                    "quantity": $('#input_main_quantity').val(),
                    "coolingTime": $('#input_main_coolingTime').val()
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

                    if(textStatus == "success"){

                    }
                },
                error: function (e)
                {
                    console.log(e);
                }
            });

        });

        $(".form-cooling-packaging").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/users"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "trolleyNo": $('#input_packaging_trolley').val(),
                    "status": $('#input_packaging_status').val(),
                    "time": $('#input_packaging_time').val()
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

                    if(textStatus == "success"){
                        
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
