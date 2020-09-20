if(navigator.onLine)
{
    $(document).ready(function(){

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "supervisor") && !(sessionStorage.getItem("role") === "store")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         
        var loaded = false

        function dataLoad(){
            if(sessionStorage.getItem("storeData")){
               loaded = true
               document.getElementById("superviser-main").style.display = "inline";
               document.getElementById("loader").style.display = "none";
            }
        }

        setInterval(dataLoad , 3000);

        
        function getStoreData(){

            const socket = io('http://34.122.82.176:9001/');
            socket.on('conn', data => {
                console.log("CONNECTION RESPONSE: ", data)
                socket.emit('getData', () => { })
            })
            socket.on('data', function (data) {
                try {
                    var d = JSON.parse(data.store);
                    console.log(d.columns);
                    console.log(d.data);
                    sessionStorage.setItem("storeData" , JSON.stringify(d))
                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getStoreData()

        function display(){

            if(loaded){

                function localStoreData(){

                    if(sessionStorage.getItem("storeData")){
                        var table_row = `<tr>
                                    <th> DATE </th>
                                    <th> PRODUCT </th>
                                    <th>QTY RECEIVED STANDARD</th>
                                    <th>QTY RECEIVED ROUGH</th>
                                    <th>DISPATCHED STANDARD</th>
                                    <th>DISPATCHED ROUGH</th>
                                    <th>ROUGH RETURNED BREAD</th>
                                    <th>BREAD IN STORE</th>
                                    <th>ROUGH BREAD IN STORE</th>
                                </tr>`;

                                var data = sessionStorage.getItem("storeData");
                                var m = JSON.parse(data);
                                console.log(m.data);

                                var bis = [];
                                var rbis = [];
                                for(var i= 0 ; i < m.data.length;i++){
                                    if( i === 0){
                                        bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6]);
                                        rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                                    }
                                    else{
                                        bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6] + bis[i-1]);
                                        rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                                    }
                                }

                                for(var i = 0; i < m.data.length; i++){


                                            var date = new Date(m.data[i][0]);
                                            var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                                            table_row += 
                                            '<tr>'+
                                                '<td>'+ finalD +'</td>'+
                                                '<td>'+m.data[i][1]+'</td>'+
                                                '<td>'+m.data[i][2]+'</td>'+
                                                '<td>'+m.data[i][3]+'</td>'+
                                                '<td>'+m.data[i][4]+'</td>'+
                                                '<td>'+m.data[i][5]+'</td>'+
                                                '<td>'+m.data[i][6]+'</td>'+
                                                '<td>'+bis[i]+'</td>'+
                                                '<td>'+rbis[i]+'</td>'+
                                            '</tr>';
                                }

                                document.getElementById('superviser_store_table').innerHTML = table_row;
                            }
                }

                localStoreData();

                setInterval(localStoreData ,10000);

                function setDateForm(){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today =  yyyy + '-' + mm + '-'+ dd;
                    $("#input_receiving_date").val(today);
                    $("#input_dispatching_date").val(today);
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

        setInterval(display , 10000);    

        

                
        $(".form-store-receiving").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            //API required
            const url = "http://34.122.82.176:9001/get/store_receiving_screen"

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "u_key": sessionStorage.getItem("ukey"), 
                    "date": $('#input_receiving_date').val(),
                    "product": $('#input_receiving_product').val(),
                    "standard_qty_recv": $('#input_receiving_standard_qty_received').val(),
                    "supervisor": $('#input_receiving_pkg_superviser').val(),
                    "rough_qty_recv": $('#input_receiving_rough_qty_received').val(),
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

        $(".form-store-dispatching").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            const url = "http://34.122.82.176:9001/get/store_dispatch_screen"

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
                    "dsp_supervisor": $('#input_dispatching_dsp_superviser').val(),
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

        date_time,product,`qty received standard`,`qty received rough`, `dispatched standard`, 
        `dispatched rough`, `rough returned`, `bread in store`, `rough bread in store`, pkg_supervisor, dsp_supervisor

        function showFilterData(){
            if(sessionStorage.getItem("filterData")){
                        var table_row = `<tr>
                        <th> DATE </th>
                        <th> PRODUCT </th>
                        <th>QTY RECEIVED STANDARD</th>
                        <th>QTY RECEIVED ROUGH</th>
                        <th>DISPATCHED STANDARD</th>
                        <th>DISPATCHED ROUGH</th>
                        <th>ROUGH RETURNED BREAD</th>
                        <th>BREAD IN STORE</th>
                        <th>ROUGH BREAD IN STORE</th>
                        <th>Pkg Supervisor</th>
                        <th>Dispatch Supervisor</th>
                    </tr>`;

                    var data = sessionStorage.getItem("filterData");
                    var m = JSON.parse(data);
                    console.log(m.data);

                    var bis = [];
                    var rbis = [];
                    for(var i= 0 ; i < m.data.length;i++){
                        if( i === 0){
                            bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6]);
                            rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                        }
                        else{
                            bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6] + bis[i-1]);
                            rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                        }
                    }

                    for(var i = 0; i < m.data.length; i++){


                                var date = new Date(m.data[i][0]);
                                var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                                table_row += 
                                '<tr>'+
                                    '<td>'+ finalD +'</td>'+
                                    '<td>'+m.data[i][1]+'</td>'+
                                    '<td>'+m.data[i][2]+'</td>'+
                                    '<td>'+m.data[i][3]+'</td>'+
                                    '<td>'+m.data[i][4]+'</td>'+
                                    '<td>'+m.data[i][5]+'</td>'+
                                    '<td>'+m.data[i][6]+'</td>'+
                                    '<td>'+bis[i]+'</td>'+
                                    '<td>'+rbis[i]+'</td>'+
                                    '<td>'+m.data[i][9]+'</td>'+
                                    '<td>'+m.data[i][10]+'</td>'+
                                '</tr>';
                    }

                document.getElementById('filter_table').innerHTML = table_row;

            }
        }

        $(".form-create-filter").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/storereport"
            document.getElementById("filterText").style.display = "inline";

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "date_from": $('#input_main_date_from').val(),
                    "date_to": $('#input_main_date_to').val(),
                    "product": $('#input_main_product_filter').val(),
                }),
                statusCode :{
                200: function() {
                        console.log("success");
                }
                },
                contentType:"application/json; charset=utf-8",
                success: function(data, textStatus, jqXHR)
                {
                    sessionStorage.setItem("filterData" , data);
                    alert(data);
                    document.getElementById("filterText").style.display = "none";
                    showFilterData();
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
