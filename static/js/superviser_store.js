if(navigator.onLine)
{
    $(document).ready(function(){

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "supervisor") && !(sessionStorage.getItem("role") === "store")){
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

        function refreshTable(){
            if(loaded){
                function localStoreData(){
                    if(sessionStorage.getItem("storeData")){
                            $('#superviser_store_table').dataTable().fnClearTable();
                            var data = sessionStorage.getItem("storeData");
                            var m = JSON.parse(data);

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
                                        var finalD = formatDate(m.data[i][0]);
                                        var date_1 = new Date(m.data[i][11])
                                        var finalD_1 = formatDate(m.data[i][11]);
                                        
                                        $('#superviser_store_table').dataTable().fnAddData([
                                            finalD,
                                            m.data[i][1],
                                            m.data[i][2],
                                            m.data[i][3],
                                            m.data[i][4],
                                            m.data[i][5],
                                            m.data[i][6],
                                            bis[i],
                                            rbis[i],
                                            m.data[i][10],
                                            finalD_1,
                                            m.data[i][12],
                                        ]);
                                    }
                    }
                }

                localStoreData();
            }
        }

        $('#refreshTable').click(function(){
            refreshTable();
        })

        $("#superviser_store_table").DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ]
        });

        $("#filter_table").DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            scrollX : true,
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
                    modal.style.display = "none";
                    alert("Something Went Wrong...");
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
                    modal.style.display = "none";
                    alert("Something Went Wrong...");
                }
            });

        });


        function showFilterData(){
            if(sessionStorage.getItem("filterData")){
                        $('#filter_table').dataTable().fnClearTable();
                        var data = sessionStorage.getItem("filterData");
                        var m = JSON.parse(data);

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
                            var finalD = formatDate(m.data[i][0]);
                            var date_1 = new Date(m.data[i][11])
                            var finalD_1 = formatDate(m.data[i][11]);
                            
                            $('#filter_table').dataTable().fnAddData([
                                finalD,
                                m.data[i][1],
                                m.data[i][2],
                                m.data[i][3],
                                m.data[i][4],
                                m.data[i][5],
                                m.data[i][6],
                                bis[i],
                                rbis[i],
                                m.data[i][9],
                                m.data[i][10],
                            ]);
                        }

                //         var table_row = `<tr>
                //         <th> DATE </th>
                //         <th> PRODUCT </th>
                //         <th>QTY RECEIVED STANDARD</th>
                //         <th>QTY RECEIVED ROUGH</th>
                //         <th>DISPATCHED STANDARD</th>
                //         <th>DISPATCHED ROUGH</th>
                //         <th>ROUGH RETURNED BREAD</th>
                //         <th>BREAD IN STORE</th>
                //         <th>ROUGH BREAD IN STORE</th>
                //         <th>Pkg Supervisor</th>
                //         <th>Dispatch Supervisor</th>
                //     </tr>`;

                //     var data = sessionStorage.getItem("filterData");
                //     var m = JSON.parse(data);
                //     console.log(m.data);

                //     var bis = [];
                //     var rbis = [];
                //     for(var i= 0 ; i < m.data.length;i++){
                //         if( i === 0){
                //             bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6]);
                //             rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                //         }
                //         else{
                //             bis.push(m.data[i][2] +m.data[i][3] -m.data[i][4] -m.data[i][5] -m.data[i][6] + bis[i-1]);
                //             rbis.push(m.data[i][3] + m.data[i][6] - m.data[i][5]);
                //         }
                //     }

                //     for(var i = 0; i < m.data.length; i++){


                //                 var date = new Date(m.data[i][0]);
                //                 var finalD = formatDate(m.data[i][0]);
                //                 table_row += 
                //                 '<tr>'+
                //                     '<td>'+ finalD +'</td>'+
                //                     '<td>'+m.data[i][1]+'</td>'+
                //                     '<td>'+m.data[i][2]+'</td>'+
                //                     '<td>'+m.data[i][3]+'</td>'+
                //                     '<td>'+m.data[i][4]+'</td>'+
                //                     '<td>'+m.data[i][5]+'</td>'+
                //                     '<td>'+m.data[i][6]+'</td>'+
                //                     '<td>'+bis[i]+'</td>'+
                //                     '<td>'+rbis[i]+'</td>'+
                //                     '<td>'+m.data[i][9]+'</td>'+
                //                     '<td>'+m.data[i][10]+'</td>'+
                //                 '</tr>';
                //     }

                // document.getElementById('filter_table').innerHTML = table_row;

            }
        }

        $(".form-create-filter").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/storereport"
            document.getElementById("filterText").style.display = "inline";

                    var JSP = $('#input_main_product_filter_store_JS:checkbox:checked').val();
                    var JMX = $('#input_main_product_filter_store_JM:checkbox:checked').val();
                    var EC = $('#input_main_product_filter_store_EC:checkbox:checked').val();
                    var OY = $('#input_main_product_filter_store_OY:checkbox:checked').val();
                    var LM = $('#input_main_product_filter_store_LM:checkbox:checked').val();
                    
                    var checks_prod = []

                    if(JSP){
                        checks_prod.push(JSP);
                    }
                    if(JMX){
                        checks_prod.push(JMX);
                    }
                    if(EC){
                        checks_prod.push(EC);
                    }
                    if(OY){
                        checks_prod.push(OY);
                    }
                    if(LM){
                        checks_prod.push(LM);
                    }

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "date_from": $('#input_main_date_from').val(),
                    "date_to": $('#input_main_date_to').val(),
                    "product": checks_prod,
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
                    alert("Successfull");
                    document.getElementById("filterText").style.display = "none";
                    showFilterData();
                },
                error: function (e)
                {
                    alert("Something Went Wrong");
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
