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

          function getProductionData(){

            const socket = io('http://34.122.82.176:9001/');
            socket.on('conn', data => {
                console.log("CONNECTION RESPONSE: ", data)
                socket.emit('getData', () => { })
            })
            socket.on('data', function (data) {
                try {
                    var d = JSON.parse(data.proddata);
                    console.log(d.columns);
                    console.log(d.data);
                    sessionStorage.setItem("prodData" , JSON.stringify(d));

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
                        <th>BAKING TIME</th>
                    </tr>`;

                    var data = sessionStorage.getItem("prodData");
                    var m = JSON.parse(data);
                    console.log(m.data);

                    for(var i = 0; i < m.data.length; i++){

                                var date = new Date(m.data[i][0]);
                                var finalD = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
                                table_row += 
                                '<tr>'+
                                    '<td>'+ finalD +'</td>'+
                                    '<td>'+m.data[i][1]+'</td>'+
                                    '<td>'+m.data[i][2]+'</td>'+
                                    '<td>'+m.data[i][3]+'</td>'+
                                    '<td>'+m.data[i][4]+'</td>'+
                                    '<td>'+m.data[i][5]+'</td>'+
                                    '<td>'+m.data[i][6]+'</td>'+
                                    '<td>'+m.data[i][7]+'</td>'+
                                    '<td>'+m.data[i][8]+'</td>'+
                                    '<td>'+m.data[i][9]+'</td>'+
                                    '<td>'+msToTime(m.data[i][10])+'</td>'+
                                    '<td>'+msToTime(m.data[i][11])+'</td>'+
                                '</tr>';
                        
                    }

                    document.getElementById('user_production_table').innerHTML = table_row;


                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getProductionData()
         

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

        
        $(".form-cooling-main").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/create_cooling_main"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "date": $('#input_main_date').val(),
                    "trolleyNo": $('#input_main_trolley').val(),
                    "product": $('#input_main_product').val(),
                    "shiftProduced": $('#input_main_shift_produced').val(),
                    "quantity": $('#input_main_quantity').val(),
                    "coolingTime": new Date().toLocaleTimeString()
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

        $(".form-cooling-packaging").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/create_cooling_packaging"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "trolleyNo": $('#input_packaging_trolley').val(),
                    "status": $('#input_packaging_status').val(),
                    "time": new Date().toLocaleTimeString()
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
