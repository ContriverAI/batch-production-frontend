if(navigator.onLine)
{
    $(document).ready(function(){


        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "user") && !(sessionStorage.getItem("role") === "cooling")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         var loaded = false

         function dataLoad(){
             if(sessionStorage.getItem("tableData")){
                loaded = true
             }
         }

         setInterval(dataLoad , 3000);

         
        function getCoolingData(){

            const socket = io('http://34.122.82.176:9001/');
            socket.on('conn', data => {
                console.log("CONNECTION RESPONSE: ", data)
                socket.emit('getData', () => { })
            })
            socket.on('data', function (data) {
                try {
                    var d = JSON.parse(data.cooling);
                    console.log(d.columns);
                    console.log(d.data);
                    sessionStorage.setItem("tableData" , JSON.stringify(d));

                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getCoolingData()

        function display(){

            if(loaded){
                
                document.getElementById("user-main").style.display = "inline";
                document.getElementById("loader").style.display = "none";

                function localCoolingData(){

                    if(sessionStorage.getItem("tableData")){
                        var table_row = `<tr>
                                    <th>Date</th>
                                    <th>Trolley</th>
                                    <th>Shift </th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Time In</th>
                                    <th>Duration</th>
                                    <th>Complete Time</th>
                                    <th>Remaining Time</th>
                                    <th>Packaging Complete </th>
                                </tr>`;

                                var data = sessionStorage.getItem("tableData");
                                var m = JSON.parse(data);
                                console.log(m.data);

                                for(var i = 0; i < m.data.length; i++){

                                    if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){

                                            var date = new Date(m.data[i][0]);
                                            var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                                            var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                                            table_row += 
                                            '<tr>'+
                                                '<td>'+ finalD +'</td>'+
                                                '<td>'+m.data[i][1]+'</td>'+
                                                '<td>'+m.data[i][9]+'</td>'+
                                                '<td>'+m.data[i][2]+'</td>'+
                                                '<td>'+m.data[i][3]+'</td>'+
                                                '<td>'+msToTime(m.data[i][4])+'</td>'+
                                                '<td>'+msToTime(m.data[i][5])+'</td>'+
                                                '<td>'+msToTime(m.data[i][6])+'</td>'+
                                                '<td>'+remTime+'</td>'+
                                                '<td>'+m.data[i][7]+'</td>'+
                                            '</tr>';
                                    }
                                }

                                document.getElementById('user_cooling_table').innerHTML = table_row;
                                // var options = '';
                    
                                // for(var i = 0; i < m.data.length; i++)
                                //     if(m.data[i][7] === "No"){
                                //         options += '<option value="'+m.data[i][1]+'">'+m.data[i][1]+'</option>';
                                //     }

                                // document.getElementById('input_packaging_trolley').innerHTML = options;
                        }
                }

                localCoolingData();
                setInterval(localCoolingData , 10000);

                function localCoolingLiveData(){

                    if(sessionStorage.getItem("tableData")){
                        var table_row = `<tr>
                                    <th>Date</th>
                                    <th>Trolley</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Time In</th>
                                    <th>Complete Time</th>
                                    <th>Remaining Time</th>
                                </tr>`;

                                var data = sessionStorage.getItem("tableData");
                                var m = JSON.parse(data);

                                for(var i = 0; i < m.data.length; i++){

                                    if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){

                                            var date = new Date(m.data[i][0]);
                                            var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                                            var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                                            table_row += 
                                            '<tr>'+
                                                '<td>'+ finalD +'</td>'+
                                                '<td>'+m.data[i][1]+'</td>'+
                                                '<td>'+m.data[i][2]+'</td>'+
                                                '<td>'+m.data[i][3]+'</td>'+
                                                '<td>'+msToTime(m.data[i][4])+'</td>'+
                                                '<td>'+msToTime(m.data[i][6])+'</td>'+
                                                '<td>'+remTime+'</td>'+
                                            '</tr>';
                                    }
                                }

                                document.getElementById('user_live_table').innerHTML = table_row;
                        }
                }

                localCoolingLiveData();
                setInterval(localCoolingLiveData , 10000);

                function localPackageData(){

                    if(sessionStorage.getItem("tableData")){
                        var table_row = `<tr>
                                    <th>Trolley</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Packaging Complete </th>
                                </tr>`;

                                var data = sessionStorage.getItem("tableData");
                                var m = JSON.parse(data);

                                for(var i = 0; i < m.data.length; i++){

                                    if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){
                                            table_row += 
                                            '<tr id='+m.data[i][1]+'>'+
                                                '<td>'+m.data[i][1]+'</td>'+
                                                '<td>'+m.data[i][2]+'</td>'+
                                                '<td>'+m.data[i][3]+'</td>'+
                                                '<td><button id = "Pak" class="btn btn-lg btn-primary btn-block" type="button">Yes</button></td>'+
                                            '</tr>';
                                    }
                                }

                                document.getElementById('user_cooling_packaging_table').innerHTML = table_row;
                        }
                }

                localPackageData();
                setInterval(localPackageData , 10000);

                
                function setDateForm(){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today =  dd + '-' + mm + '-'+ yyyy;
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


                $("#Logout").click(function(event){
                    event.preventDefault();
                    sessionStorage.clear();
                    window.location.pathname = "/";
                });

            }
        }

        setInterval(display ,10000);


            $(document).on("click" , "#Pak" ,  function(e) {
                e.preventDefault();
                var pid = $(this).parent().parent().attr("id");
                console.log(pid); 

                var modal = document.getElementById("myModal");
                modal.style.display = "block";

                const url = "http://34.122.82.176:9001/get/create_cooling_packaging"

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "u_key": sessionStorage.getItem("ukey"), 
                            "trolleyNo": pid,
                            "status": "Yes",
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

            
                
            $(".form-cooling-main").submit(function(event) {
                event.stopPropagation();
                event.preventDefault();

                
                var modal = document.getElementById("myModal");
                modal.style.display = "block";

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
                        "coolingTime": new Date().toLocaleTimeString(),
                        "duration": " ",
                        "completeTime": " "
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
                        console.log(e);
                    }
                });

                

            });

            $(".form-cooling-packaging").submit(function(event) {
                event.stopPropagation();
                event.preventDefault();

                
                var modal = document.getElementById("myModal");
                modal.style.display = "block";

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
                        modal.style.display = "none";
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
