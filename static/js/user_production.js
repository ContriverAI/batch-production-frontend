if(navigator.onLine)
{
    $(document).ready(function(){

        
        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "user") && !(sessionStorage.getItem("role") === "production")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         function formatDate(d){
            var date = new Date(d);

            if ( isNaN( date .getTime() ) ) 
            {
                return d;
            }
            else
            {
            
                var month = new Array();
                month[0] = "Jan";
                month[1] = "Feb";
                month[2] = "Mar";
                month[3] = "Apr";
                month[4] = "May";
                month[5] = "Jun";
                month[6] = "Jul";
                month[7] = "Aug";
                month[8] = "Sept";
                month[9] = "Oct";
                month[10] = "Nov";
                month[11] = "Dec";

                day = date.getDate();
                
                if(day < 10)
                {
                    day = "0"+day;
                }
                
                return    day  + "-" +month[date.getMonth()] + "-" + date.getFullYear();
            }
    
        }

         
         function getProductionData(){

            const socket = io('http://192.168.8.3:9003/');
            socket.on('conn', data => {
                console.log("CONNECTION RESPONSE: ", data)
                socket.emit('getData', () => { })
            })
            socket.on('data', function (data) {
                try {
                    var d = JSON.parse(data.proddata);
                    sessionStorage.setItem("prodData" , JSON.stringify(d));

                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getProductionData()

        
        var loaded = false

         function dataLoad(){
             if(sessionStorage.getItem("prodData")){
                loaded = true
                document.getElementById("user-main").style.display = "inline";
                document.getElementById("loader").style.display = "none";
             }
         }

         setInterval(dataLoad , 3000);

         function refreshTable(){
             if(loaded){
                 
                function localProductionData(){
                    if(sessionStorage.getItem("prodData")){
                            var tb = $('#user_production_table').DataTable();
                            $('#user_production_table').dataTable().fnClearTable();
                            var data = sessionStorage.getItem("prodData");
                            var m = JSON.parse(data);

                            for(var i = 0; i < m.data.length; i++){
                                        var date = new Date(m.data[i][0]);
                                        var finalD = formatDate(m.data[i][0]);
                                        
                                        $('#user_production_table').dataTable().fnAddData([
                                            finalD,
                                            m.data[i][2],
                                            m.data[i][8],
                                            m.data[i][1],
                                            m.data[i][3],
                                            m.data[i][4],
                                            m.data[i][13],
                                            m.data[i][10],
                                            msToTime(m.data[i][5]),
                                            m.data[i][9],
                                            msToTime(m.data[i][6]),
                                            m.data[i][11],
                                            msToTime(m.data[i][12]),
                                        ]);
                            }

                            var options = ''

                            for(var i = 0; i < m.data.length; i++){
                                if(m.data[i][11] !== "Yes")
                                    options += '<option value="'+m.data[i][8]+'">'+m.data[i][8]+'</option>';
                            }
                                

                            document.getElementById('input_recall_batch').innerHTML = options;
                        }
                }

                localProductionData()
             }
         }

         $('#refreshTable').click(function(){
             refreshTable();
         })
         
         $("#user_production_table").DataTable({
            retrieve: true,
            ordering: false,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ]
        });

         function msToTime(duration) {
            var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
        
            return hours + ":" + minutes ;
        }

        function display(){

            if(loaded){
                function setDateForm(){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today =  dd + '-' + mm + '-'+ yyyy;
                    console.log(today);
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


                function localProductionBakeData(){
                    if(sessionStorage.getItem("prodData")){
                            var table_row = `<tr>  
                                <th>Batch</th>
                                <th>Mixing Time</th>
                                <th>Status</th>
                            </tr>`;

                            var data = sessionStorage.getItem("prodData");
                            var m = JSON.parse(data);

                            for(var i = 0; i < m.data.length; i++){
                                if(m.data[i][9] === "Unbaked" && m.data[i][11] === "No"){
                                        table_row += 
                                        '<tr id='+m.data[i][8]+'>'+
                                            '<td>'+m.data[i][8]+'</td>'+
                                            '<td>'+msToTime(m.data[i][5])+'</td>'+
                                            '<td><button style="width: 200px" id = "Bak" class="btn btn-lg btn-primary btn-block" type="button">Baked</button></td>'+
                                        '</tr>';
                                }
                                
                            }


                            document.getElementById('user_production_bake_table').innerHTML = table_row;

                        }
                }

                localProductionBakeData();
                setInterval(localProductionBakeData , 10000);

                $("#Logout").click(function(event){
                    event.preventDefault();
                    sessionStorage.clear();
                    window.location.pathname = "/";
                });
            }
        }
        setInterval(display , 10000);

        $(document).on("click" , "#Bak"  ,  function(e) {
            e.preventDefault();
            var pid = $(this).parent().parent().attr("id");

            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            const url = "http://192.168.8.3:9003/get/production_bake_screen"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "batch": pid,
                    "status": "Baked",
                    "time": new Date().toLocaleTimeString(),
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
                    modal.style.display = "none";
                    alert(data);   
                    var id = "#" + pid;   
                    $(id).remove();              
                },
                error: function (e)
                {
                    console.log(e);
                }
            });
        
        });
        

            //change tables
            $(".form-production-main").submit(function(event) {
                event.stopPropagation();
                event.preventDefault();

                
                var modal = document.getElementById("myModal");
                modal.style.display = "block";

                //API required
                const url = "http://192.168.8.3:9003/get/production_main_screen"

                $.ajax({
                    url:url,
                    type:"POST",
                    data:JSON.stringify({
                        "u_key": sessionStorage.getItem("ukey"), 
                        "date": $('#input_main_date').val(),
                        "batch": $('#input_main_Batch').val(),
                        "yeast": $('#input_main_yeastused').val(),
                        "flour": $('#input_main_floorused').val(),
                        "yield_val": $('#input_main_yield_value').val(),
                        "shift": $('#input_main_shift').val(),
                        "product": $('#input_main_product').val(),
                        "remix": $('#input_main_remixused').val(),
                        "time": new Date().toLocaleTimeString(),
                
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
                        modal.style.display = "none";
                        alert(data);                    
                    },
                    error: function (e)
                    {
                        modal.style.display = "none";
                        alert("Something Went Wrong...");
                    }
                });

                

            });
            
            //change tables
            $(".form-production-recall").submit(function(event) {
                event.stopPropagation();
                event.preventDefault();

                
                var modal = document.getElementById("myModal");
                modal.style.display = "block";

                //API required
                const url = "http://192.168.8.3:9003/get/production_recall_screen"

                $.ajax({
                    url:url,
                    type:"POST",
                    data:JSON.stringify({
                        "u_key": sessionStorage.getItem("ukey"), 
                        "batch": $('#input_recall_batch').val(),
                        "cancel": $('#input_recall_cancelbatch').val(),
                        "time": new Date().toLocaleTimeString(),
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
                        modal.style.display = "none";
                        alert(data);
                    },
                    error: function (e)
                    {
                        modal.style.display = "none";
                        alert("Something Went Wrong...");
                    }
                });

                

            });
            
            //change tables
            $(".form-production-bake").submit(function(event) {
                event.stopPropagation();
                event.preventDefault();

                
                var modal = document.getElementById("myModal");
                modal.style.display = "block";

                const url = "http://192.168.8.3:9003/get/production_bake_screen"

                $.ajax({
                    url:url,
                    type:"POST",
                    data:JSON.stringify({
                        "u_key": sessionStorage.getItem("ukey"), 
                        "batch": $('#input_bake_batch').val(),
                        "status": $('#input_bake_status').val(),
                        "time": new Date().toLocaleTimeString(),
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
                        modal.style.display = "none";
                        alert(data);                    
                    },
                    error: function (e)
                    {
                        modal.style.display = "none";
                        alert("Something Went Wrong...");
                    }
                });

            });
    
    });
}
else
{
    alert('You are Offline')
}
