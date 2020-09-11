if(navigator.onLine)
{
    $(document).ready(function(){

        function msToTime(duration) {
            var milliseconds = parseInt((duration % 1000) / 100),
              seconds = Math.floor((duration / 1000) % 60),
              minutes = Math.floor((duration / (1000 * 60)) % 60),
              hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
          
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
          
            return hours + ":" + minutes ;
          }

        function getTableData(){

            var settings = {
                "url": "http://34.122.82.176:9001/get/cooling_data",
                "method": "GET",
                "timeout": 0,
              };
              
              $.ajax(settings).done(function (response) {
                var d = JSON.parse(response);
                console.log(d.columns);
                console.log(d.data);
                sessionStorage.setItem("tableData" , JSON.stringify(d));
                
              });

              var table_row = `<tr>
                    <th>Date</th>
                    <th>Trolley</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Time In</th>
                    <th>Duration</th>
                    <th>Complete Time</th>
                    <th>Packaging Complete </th>
                </tr>`;

                var data = sessionStorage.getItem("tableData");
                var m = JSON.parse(data);
                console.log(m.data);

                for(var i = 0; i < m.data.length; i++){

                    if(m.data[i][7] === "No"){

                            var date = new Date(m.data[i][0]);
                            var finalD = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
                            table_row += 
                            '<tr>'+
                                '<td>'+ finalD +'</td>'+
                                '<td contenteditable="true">'+m.data[i][1]+'</td>'+
                                '<td contenteditable="true">'+m.data[i][2]+'</td>'+
                                '<td contenteditable="true">'+m.data[i][3]+'</td>'+
                                '<td contenteditable="true">'+msToTime(m.data[i][4])+'</td>'+
                                '<td contenteditable="true">'+msToTime(m.data[i][5])+'</td>'+
                                '<td contenteditable="true">'+msToTime(m.data[i][6])+'</td>'+
                                '<td contenteditable="true">'+m.data[i][7]+'</td>'+
                            '</tr>';
                    }
                }


                document.getElementById('superviser_cooling_table').innerHTML = table_row;
        }

        getTableData();

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "supervisor") && !(sessionStorage.getItem("role") === "cooling")){
                window.location.pathname = "/";
            }
         }
         
         window.onload = function(){
             checkLogin();
         }

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