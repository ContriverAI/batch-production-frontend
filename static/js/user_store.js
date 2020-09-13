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

            //need api store_data

            var settings = {
                "url": "http://34.122.82.176:9001/get/store_data",
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
                    <th>QTY RECEIVED STANDARD</th>
                    <th>QTY RECEIVED ROUGH</th>
                    <th>DISPATCHED STANDARD</th>
                    <th>DISPATCHED ROUGH</th>
                    <th>ROUGH RETURNED BREAD</th>
                    <th>BREAD IN STORE</th>
                    <th>ROUGH BREAD IN STORE</th>
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
                            '</tr>';
                    }
                }

                document.getElementById('user_cooling_table').innerHTML = table_row;


                var options = '';
               
                for(var i = 0; i < m.data.length; i++)
                    options += '<option value="'+m.data[i][1]+'">'+m.data[i][1]+'</option>';

                document.getElementById('input_packaging_trolley').innerHTML = options;
        }

         setInterval(getTableData, 2000);
        // getTableData();

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "user") && !(sessionStorage.getItem("role") === "cooling")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         $("#Logout").click(function(event){
            event.preventDefault();
            sessionStorage.clear();
            window.location.pathname = "/";
         });

        
        $(".form-store-receiving").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            //API required
            const url = "http://34.122.82.176:9001/get/create_store_receiving"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "date": $('#input_receiving_date').val(),
                    "product": $('#input_receiving_product').val(),
                    "std_received": $('#input_receiving_standard_qty_received').val(),
                    "pkg_superviser": $('#input_receiving_pkg_superviser').val(),
                    "rough_received": $('#input_receiving_rough_qty_received').val(),
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

        $(".form-store-dispatching").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/create_store_dispatching"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "date": $('#input_dispatching_date').val(),
                    "product": $('#input_dispatching_product').val(),
                    "std_dispatched": $('#input_dispatching_standard_dispatched').val(),
                    "rough_dispatched": $('#input_dispatching_rough_dispatched').val(),
                    "rough_returned": $('#input_dispatching_rough_returned').val(),
                    "dsp_superviser": $('#input_dispatching_dsp_superviser').val(),
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
