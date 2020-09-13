if(navigator.onLine)
{
    $(document).ready(function(){

        function setDateForm(){
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today =  yyyy + '-' + mm + '-'+ dd;
            $("#input_main_date").val(today);
        }

        setDateForm()

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

            //production_data api required
            var settings = {
                "url": "http://34.122.82.176:9001/get/production_data",
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
                    <th>DATE</th>
                    <th>FLOUR</th>
                    <th>SHIFT</th>
                    <th>REMIX</th>
                    <th>YEAST</th>
                    <th>JSP</th>
                    <th>ECO</th>
                    <th>JEX</th>
                    <th>OYOKUN</th>
                    <th>MIDI</th>
                    <th>MIXING TIME</th>
                    <th>STATUS</th>
                    <th>BAKING TIME</th>
                </tr>`;

                var data = sessionStorage.getItem("tableData");
                var m = JSON.parse(data);
                console.log(m.data);

                for(var i = 0; i < m.data.length; i++){

                    if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){

                            var date = new Date(m.data[i][0]);
                            var finalD = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
                            table_row += 
                            '<tr>'+
                                '<td>'+ finalD +'</td>'+
                                '<td>'+m.data[i][1]+'</td>'+
                                '<td>'+m.data[i][2]+'</td>'+
                                '<td>'+m.data[i][3]+'</td>'+
                                '<td>'+msToTime(m.data[i][4])+'</td>'+
                                '<td>'+msToTime(m.data[i][5])+'</td>'+
                                '<td>'+msToTime(m.data[i][6])+'</td>'+
                                '<td>'+m.data[i][7]+'</td>'+
                                //TODO : 
                            '</tr>';
                    }
                }

                document.getElementById('user_production_table').innerHTML = table_row;

        }

         setInterval(getTableData, 2000);
        // getTableData();

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "user") && !(sessionStorage.getItem("role") === "production")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         $("#Logout").click(function(event){
            event.preventDefault();
            sessionStorage.clear();
            window.location.pathname = "/";
         });

        //change tables
        $(".form-production-main").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            //API required
            const url = "http://34.122.82.176:9001/get/create_production_main"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "date": $('#input_main_date').val(),
                    "batch": $('#input_main_Batch').val(),
                    "yeast_used": $('#input_main_yeastused').val(),
                    "floor_used": $('#input_main_floorused').val(),
                    "yield": $('#input_main_yield').val(),
                    "shift": $('#input_main_shift').val(),
                    "product": $('#input_main_product').val(),
                    "remix_used": $('#input_main_remixused').val(),
                    "time": $('#input_main_time').val(),
            
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
                    alert(data);                    
                },
                error: function (e)
                {
                    console.log(e);
                }
            });

            

        });
        
        //change tables
        $(".form-production-recall").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            //API required
            const url = "http://34.122.82.176:9001/get/create_production_recall"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "batch": $('#input_recall_batch').val(),
                    "status": $('#input_packaging_status').val(),
                    "cancelbatch": $('#input_recall_cancelbatch').val(),
                    "time": $('#input_recall_time').val(),
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
                    alert(data);
                },
                error: function (e)
                {
                    console.log(e);
                }
            });

            

        });
        
        //change tables
        $(".form-production-bake").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/create_production_bake"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "batch": $('#input_bake_batch').val(),
                    "status": $('#input_bake_status').val(),
                    "time": $('#input_bake_time').val(),
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
                    alert(data);                    
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
