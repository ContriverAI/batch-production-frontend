if(navigator.onLine)
{
    $(document).ready(function(){

        function TableEdit() {


            // $('td').click(function() {
            
            
            //     var td_value = $(this).html();
            //     var input_field = '<input type="text" id="edit" value="' + td_value + '" />'
            //     $(this).empty().append(input_field);
            //     $('input').focus();
            
            //     $('td').off('click');
            
            //     $(this).find('input').blur(function(){
            //         var new_text = $(this).val();
            //         $(this).parent().html(new_text);
            //         console.log($(this).parent());
            //         console.log(new_text);
            //         TableEdit();
            //     })
            
            // });

            // $(document).on("click" , "td"  ,  function(e) {
            //     e.preventDefault();
            //     console.log($(this).parent().attr("id"));
            //     console.log($(this).attr('id'));
            //     var td_value = $(this).html();
            //     var input_field = '<input type="text" id="edit" value="' + td_value + '" />'
            //     $(this).empty().append(input_field);
            //     $('input').focus();
            
            //     $('td').off('click');
            
            //     $(this).find('input').blur(function(){
            //         var new_text = $(this).val();
            //         $(this).parent().html(new_text);
            //         console.log(new_text);
            //         TableEdit();
            //     })
            
            // });
        }

        //TableEdit();
        
        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "supervisor") && !(sessionStorage.getItem("role") === "cooling")){
                window.location.pathname = "/";
            }
         }
         
         window.onload = function(){
             checkLogin();
         }

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
             if(sessionStorage.getItem("tableData")){
                loaded = true
                document.getElementById("superviser-main").style.display = "inline";
                document.getElementById("loader").style.display = "none";
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

        function refreshTable(){
            if(loaded){
                function localCoolingData(){

                    if(sessionStorage.getItem("tableData")){
                                $('#superviser_cooling_table').dataTable().fnClearTable();
                                var data = sessionStorage.getItem("tableData");
                                var m = JSON.parse(data);

                                for(var i = 0; i < m.data.length; i++){

                                            var date = new Date(m.data[i][0]);
                                            var finalD = formatDate(m.data[i][0]);
                                            var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                                            $('#superviser_cooling_table').dataTable().fnAddData([
                                                finalD,
                                                m.data[i][1],
                                                m.data[i][9],
                                                m.data[i][2],
                                                m.data[i][3],
                                                msToTime(m.data[i][4]),
                                                msToTime(m.data[i][5]),
                                                msToTime(m.data[i][6]),
                                                remTime,
                                                m.data[i][7],
                                            ]);                                                                                         
                                }  
                        }
                }
                localCoolingData();

            }
        }

        $('#refreshTable').click(function(){
            refreshTable();
        })

        $("#superviser_cooling_table").DataTable({
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

            if(loaded) {

                refreshTable();

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
                                console.log(m.data);

                                for(var i = 0; i < m.data.length; i++){

                                    if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){

                                            var date = new Date(m.data[i][0]);
                                            var finalD = formatDate(m.data[i][0]);
                                            var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                                            if( remTime === "Done"){
                                                table_row += 
                                                '<tr style="background-color:#C6DEB5">'+
                                                    '<td>'+ finalD +'</td>'+
                                                    '<td>'+m.data[i][1]+'</td>'+
                                                    '<td>'+m.data[i][2]+'</td>'+
                                                    '<td>'+m.data[i][3]+'</td>'+
                                                    '<td>'+msToTime(m.data[i][4])+'</td>'+
                                                    '<td>'+msToTime(m.data[i][6])+'</td>'+
                                                    '<td>'+remTime+'</td>'+
                                                '</tr>';
                                            }
                                            else{
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
                                                '<td><button style="width: 200px" id = "Pak" class="btn btn-lg btn-primary btn-block" type="button">Yes</button></td>'+
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
                modal.style.display = "none";
                alert("Something Went Wrong...");
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

                for(var i = 0; i < m.data.length; i++){

                            var date = new Date(m.data[i][0]);
                            var finalD = formatDate(m.data[i][0]);
                            var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                            $('#filter_table').dataTable().fnAddData([
                                finalD,
                                m.data[i][1],
                                m.data[i][2],
                                m.data[i][3],
                            ]);                                                                                         
                }  

                

                // var table_row = `<tr>`;

                //         for(var i = 0; i < m.columns.length; i++){

                //             table_row += '<th>'+ m.columns[i] +'</th>';
                        
                //         }

                //     table_row += `</tr>`


                //         for(var i = 0; i < m.data.length; i++){

                //                     var date = new Date(m.data[i][0]);
                //                     var finalD = formatDate(m.data[i][0]);

                //                     table_row += 
                //                     '<tr>'+
                //                         '<td>'+ finalD +'</td>'+
                //                         '<td>'+m.data[i][1]+'</td>'+
                //                         '<td>'+m.data[i][2]+'</td>'+
                //                         '<td>'+m.data[i][3]+'</td>'+
                //                     '</tr>';
                            
                //         }

                //         document.getElementById('filter_table').innerHTML = table_row;
                }
        }


        $(".form-create-filter").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/coolingreport"
            document.getElementById("filterText").style.display = "inline";

                    var JSP = $('#input_main_product_filter_cooling_JS:checkbox:checked').val();
                    var JMX = $('#input_main_product_filter_cooling_JM:checkbox:checked').val();
                    var EC = $('#input_main_product_filter_cooling_EC:checkbox:checked').val();
                    var OY = $('#input_main_product_filter_cooling_OY:checkbox:checked').val();
                    var LM = $('#input_main_product_filter_cooling_LM:checkbox:checked').val();
                    
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

                    var check_pack = []

                    var Y = $('#input_packaging_status_filter_cooling_Y:checkbox:checked').val();
                    var N = $('#input_packaging_status_filter_cooling_N:checkbox:checked').val();
                    
                    
                    if(Y){
                        check_pack.push(Y);
                    }
                    if(N){
                        check_pack.push(N);
                    }

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "date_from": $('#input_main_date_from').val(),
                    "date_to": $('#input_main_date_to').val(),
                    "product": checks_prod,
                    "packaging": check_pack,
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
