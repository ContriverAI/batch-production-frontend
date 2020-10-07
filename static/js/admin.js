if(navigator.onLine)
{
    $(document).ready(function(){

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "admin") && !(sessionStorage.getItem("role") === "system")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

        var loaded = false

         function dataLoad(){
             if(sessionStorage.getItem("tableData")){
                loaded = true
                document.getElementById("admin-main").style.display = "inline";
                document.getElementById("loader").style.display = "none";
             }
         }

         setInterval(dataLoad , 3000);

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

         
         function getCoolingData(){

            const socket = io('http://34.122.82.176:9001/');
            socket.on('conn', data => {
                console.log("CONNECTION RESPONSE: ", data)
                socket.emit('getData', () => { })
            })
            socket.on('data', function (data) {
                try {
                    var dc = JSON.parse(data.cooling);
                    var dp = JSON.parse(data.proddata);
                    var ds = JSON.parse(data.store);
                    sessionStorage.setItem("tableData" , JSON.stringify(dc));
                    sessionStorage.setItem("prodData" , JSON.stringify(dp));
                    sessionStorage.setItem("storeData" , JSON.stringify(ds));

                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getCoolingData()

        function display(){

                if( loaded ) {

                        $("#Logout").click(function(event){
                            event.preventDefault();
                            sessionStorage.clear();
                            window.location.pathname = "/";
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


                        function localCoolingData(){

                            if(sessionStorage.getItem("tableData")){
                                        $('#cooling_table').dataTable().fnClearTable();
                                        var data = sessionStorage.getItem("tableData");
                                        var m = JSON.parse(data);

                                        for(var i = 0; i < m.data.length; i++){

                                            if(m.data[i][7] === "No" || m.data[i][7] === "no"  ){

                                                    var date = new Date(m.data[i][0]);
                                                    var finalD = formatDate(m.data[i][0]);
                                                    var remTime = msToTime(m.data[i][11]) === "00:00"? "Done" : msToTime(m.data[i][11]);

                                                    $('#cooling_table').dataTable().fnAddData([
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
                        }

                        localCoolingData();
                        setInterval(localCoolingData , 10000);

                        function localProductionData(){
                            if(sessionStorage.getItem("prodData")){
                                    var tb = $('#production_table').DataTable();
                                    $('#production_table').dataTable().fnClearTable();
                                    var data = sessionStorage.getItem("prodData");
                                    var m = JSON.parse(data);

                                    for(var i = 0; i < m.data.length; i++){
                                                var date = new Date(m.data[i][0]);
                                                var finalD = formatDate(m.data[i][0]);
                                                
                                                $('#production_table').dataTable().fnAddData([
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
                                }
                        }

                        localProductionData();
                        setInterval(localProductionData , 10000);

                        function localStoreData(){

                            if(sessionStorage.getItem("storeData")){
                                        
                                        $('#store_table').dataTable().fnClearTable();
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
                                                    
                                                    $('#store_table').dataTable().fnAddData([
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
                        setInterval(localStoreData , 10000);

                        function getUsersData(){

                            var settings = {
                                "url": "http://34.122.82.176:9001/get/allusers",
                                "method": "GET",
                            };
                            
                            $.ajax(settings).done(function (response) {
                                var d = JSON.parse(response);
                                sessionStorage.setItem("usersData" , JSON.stringify(d));
                                displayUsers();
                            });
                        }
                        
                        setInterval(getUsersData , 7000);

                        function displayUsers(){
                            
                                var table_row = `<tr>
                                    <th>Username</th>
                                    <th>Designation</th>
                                    <th>Role</th>
                                </tr>`;

                                var data = sessionStorage.getItem("usersData");
                                var m = JSON.parse(data);

                                for(var i = 0; i < m.data.length; i++){
                                    table_row += 
                                    '<tr>'+
                                        '<td>'+m.data[i][0]+'</td>'+
                                        '<td>'+m.data[i][2]+'</td>'+
                                        '<td>'+m.data[i][3]+'</td>'+
                                    '</tr>';
                                }


                                document.getElementById('users_table').innerHTML = table_row;
                        }

                        function getConfigData(){

                            var settings = {
                                "url": "http://34.122.82.176:9001/get/configparams",
                                "method": "GET",
                            };
                            
                            $.ajax(settings).done(function (response) {
                                var d = JSON.parse(response);
                                sessionStorage.setItem("configData" , JSON.stringify(d));
                                displayConfigData();
                            });

                        }

                        setInterval(getConfigData , 7000);

                        function displayConfigData(){
                            
                                var table_row = `<tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Cooling Duration (in mins)</th>
                                </tr>`;

                            var data = sessionStorage.getItem("configData");
                            var m = JSON.parse(data);

                            for(var i = 0; i < m.data.length; i++){
                                table_row += 
                                '<tr>'+
                                    '<td>'+m.data[i][0]+'</td>'+
                                    '<td>'+m.data[i][1]+'</td>'+
                                    '<td>'+msToTime(m.data[i][2])+'</td>'+
                                '</tr>';
                            }


                            document.getElementById('config_table').innerHTML = table_row;
                        }

                    }
                }

                setInterval(display , 10000);

                $(".form-create-config").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const url = "http://34.122.82.176:9001/get/updateconfigparams"
                    document.getElementById("updatingText").style.display = "inline";

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "productCode": $('#input_main_product').val(),
                            "duration": $('#input_duration').val()+":00",
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
                            document.getElementById("updatingText").style.display = "none";
                            display();
                        },
                        error: function (e)
                        {
                            console.log(e);
                        }
                    });

                });

                
                        
                $(".form-create-user").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const url = "http://34.122.82.176:9001/get/create_user"
                    document.getElementById("creatingText").style.display = "inline";

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "username": $('#input_username').val(),
                            "password": $('#input_password').val(),
                            "designation": $('#inputDesignation').val(),
                            "role": $('#inputRole').val()
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
                            document.getElementById("creatingText").style.display = "none";
                            display();
                        },
                        error: function (e)
                        {
                            console.log(e);
                        }
                    });

                });

                

                $(".form-update-user").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const url = "http://34.122.82.176:9001/get/update_user"
                    document.getElementById("updatingText").style.display = "inline";

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "username": $('#input_update_username').val(),
                            "password": $('#input_update_password').val(),
                            "designation": $('#inputUpdateDesignation').val(),
                            "role": $('#inputUpdateRole').val()
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
                            document.getElementById("updatingText").style.display = "none";
                            display();
                        },
                        error: function (e)
                        {
                            console.log(e);
                        }
                    });

                });

                $(".form-delete-user").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const url = "http://34.122.82.176:9001/get/delete_user"
                    document.getElementById("deletingText").style.display = "inline";

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "username": $('#input_delete_username').val()
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
                            document.getElementById("deletingText").style.display = "none";
                            display();
                        },
                        error: function (e)
                        {
                            console.log(e);
                        }
                    });

                });

                $("#createUserBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#updateUserBtn").removeClass("disabled");
                    $("#deleteUserBtn").removeClass("disabled");
                    document.getElementById("createUserForm").style.display = "inline";
                    document.getElementById("updateUserForm").style.display = "none";
                    document.getElementById("deleteUserForm").style.display = "none";

                });

                $("#updateUserBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#createUserBtn").removeClass("disabled");
                    $("#deleteUserBtn").removeClass("disabled");
                    document.getElementById("createUserForm").style.display = "none";
                    document.getElementById("updateUserForm").style.display = "inline";
                    document.getElementById("deleteUserForm").style.display = "none";

                    var data = sessionStorage.getItem("usersData");
                    var m = JSON.parse(data)

                    var options = '';
                    

                    for(var i = 0; i < m.data.length; i++)
                        options += '<option value="'+m.data[i][0]+'">'+m.data[i][0]+'</option>';

                    document.getElementById('input_update_username').innerHTML = options;

                });

                $("#deleteUserBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#createUserBtn").removeClass("disabled");
                    $("#updateUserBtn").removeClass("disabled");
                    document.getElementById("createUserForm").style.display = "none";
                    document.getElementById("updateUserForm").style.display = "none";
                    document.getElementById("deleteUserForm").style.display = "inline";

                    var data = sessionStorage.getItem("usersData");
                    var m = JSON.parse(data);

                    var options = '';
                    

                    for(var i = 0; i < m.data.length; i++)
                        options += '<option value="'+m.data[i][0]+'">'+m.data[i][0]+'</option>';

                    document.getElementById('input_delete_username').innerHTML = options;


                });

                $("#coolingBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#productionBtn").removeClass("disabled");
                    $("#storeBtn").removeClass("disabled");
                    document.getElementById("createCoolingForm").style.display = "inline";
                    document.getElementById("createProductionForm").style.display = "none";
                    document.getElementById("createStoreForm").style.display = "none";
                });

                $("#productionBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#coolingBtn").removeClass("disabled");
                    $("#storeBtn").removeClass("disabled");
                    document.getElementById("createCoolingForm").style.display = "none";
                    document.getElementById("createProductionForm").style.display = "inline";
                    document.getElementById("createStoreForm").style.display = "none";
                });

                $("#storeBtn").click(function(){
                    $(this).addClass("disabled");
                    $("#coolingBtn").removeClass("disabled");
                    $("#productionBtn").removeClass("disabled");
                    document.getElementById("createCoolingForm").style.display = "none";
                    document.getElementById("createProductionForm").style.display = "none";
                    document.getElementById("createStoreForm").style.display = "inline";
                });

                function showFilterCoolingData(){
                    if(sessionStorage.getItem("filterCoolingData")){
                        
                        var data = sessionStorage.getItem("filterCoolingData");
                        var m = JSON.parse(data);
        
                        var table_row = `<tr>`;
        
                                for(var i = 0; i < m.columns.length; i++){
        
                                    table_row += '<th>'+ m.columns[i] +'</th>';
                                
                                }
        
                            table_row += `</tr>`
        
        
                                for(var i = 0; i < m.data.length; i++){
        
                                            var date = new Date(m.data[i][0]);
                                            var finalD = formatDate(m.data[i][0]);
        
                                            table_row += 
                                            '<tr>'+
                                                '<td>'+ finalD +'</td>'+
                                                '<td>'+m.data[i][1]+'</td>'+
                                                '<td>'+m.data[i][2]+'</td>'+
                                                '<td>'+m.data[i][3]+'</td>'+
                                            '</tr>';
                                    
                                }
        
                                document.getElementById('filter_table').innerHTML = table_row;
                        }
                }
        
        
                $(".form-create-cooling").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();
        
                    const url = "http://34.122.82.176:9001/get/coolingreport"
                    document.getElementById("coolingText").style.display = "inline";

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
                            "date_from": $('#input_main_date_from_cooling').val(),
                            "date_to": $('#input_main_date_to_cooling').val(),
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
                            sessionStorage.setItem("filterCoolingData" , data);
                            alert("Successfull");
                            document.getElementById("coolingText").style.display = "none";
                            showFilterCoolingData();
                        },
                        error: function (e)
                        {
                            alert("Something Went Wrong");
                            console.log(e);
                        }
                    });
        
                });

                function showFilterProductionData(){
                    if(sessionStorage.getItem("filterProductionData")){
                                var table_row = `<tr>  
                                    <th>Date</th>
                                    <th>Product</th>
                                    <th>Shift</th>
                                    <th>Batch</th>
                                    <th>sum(flour)</th>
                                    <th>sum(remix)</th>
                                    <th>sum(yeast)</th>
                                    <th>sum(yield)</th>
                                    <th>status</th>
                                    <th>Batch Recall</th>
                                </tr>`;
            
                                var data = sessionStorage.getItem("filterProductionData");
                                var m = JSON.parse(data);
                                console.log(m.data);
        
                                for(var i = 0; i < m.data.length; i++){
                                        var date = new Date(m.data[i][0]);
                                        var finalD = formatDate(m.data[i][0]);
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
                                        '</tr>';
                                    
                                }
        
                                document.getElementById('filter_table').innerHTML = table_row;
        
                    }
                }

                $(".form-create-production").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();
        
                    const url = "http://34.122.82.176:9001/get/productionreport"
                    document.getElementById("productionText").style.display = "inline";

                    var JSP = $('#input_main_product_filter_production_JS:checkbox:checked').val();
                    var JMX = $('#input_main_product_filter_production_JM:checkbox:checked').val();
                    var EC = $('#input_main_product_filter_production_EC:checkbox:checked').val();
                    var OY = $('#input_main_product_filter_production_OY:checkbox:checked').val();
                    var LM = $('#input_main_product_filter_production_LM:checkbox:checked').val();
                    
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

                    var Y = $('#input_packaging_status_filter_cooling_B:checkbox:checked').val();
                    var N = $('#input_packaging_status_filter_cooling_U:checkbox:checked').val();
                    
                    
                    if(Y){
                        check_pack.push(Y);
                    }
                    if(N){
                        check_pack.push(N);
                    }

                    var check_recall = []

                    var Yes = $('#input_recall_status_filter_cooling_B:checkbox:checked').val();
                    var No = $('#input_recall_status_filter_cooling_U:checkbox:checked').val();
                    
                    
                    if(Yes){
                        check_recall.push(Yes);
                    }
                    if(No){
                        check_recall.push(No);
                    }

                    var check_shift = []

                    var a = $('#input_shift_1:checkbox:checked').val();
                    var b = $('#input_shift_2:checkbox:checked').val();
                    var c = $('#input_shift_3:checkbox:checked').val();
                    var d = $('#input_shift_4:checkbox:checked').val();
                    var e = $('#input_shift_5:checkbox:checked').val();
                    var f = $('#input_shift_6:checkbox:checked').val();
                    var g = $('#input_shift_7:checkbox:checked').val();
                    var h = $('#input_shift_8:checkbox:checked').val();
                    var i = $('#input_shift_9:checkbox:checked').val();
                    var j = $('#input_shift_10:checkbox:checked').val();
                    var k = $('#input_shift_11:checkbox:checked').val();
                    var l = $('#input_shift_12:checkbox:checked').val();
                    var m = $('#input_shift_13:checkbox:checked').val();

                    if(a){
                        check_shift.push(a);
                    }
                    if(b){
                        check_shift.push(b);
                    }
                    if(c){
                        check_shift.push(c);
                    }
                    if(d){
                        check_shift.push(d);
                    }
                    if(e){
                        check_shift.push(e);
                    }
                    if(f){
                        check_shift.push(f);
                    }
                    if(g){
                        check_shift.push(g);
                    }
                    if(h){
                        check_shift.push(h);
                    }
                    if(i){
                        check_shift.push(i);
                    }
                    if(j){
                        check_shift.push(j);
                    }
                    if(k){
                        check_shift.push(k);
                    }
                    if(l){
                        check_shift.push(l);
                    }
                    if(m){
                        check_shift.push(m);
                    }

                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "date_from": $('#input_main_date_from_production').val(),
                            "date_to": $('#input_main_date_to_production').val(),
                            "product": checks_prod,
                            "status": check_pack,
                            "shift" : check_shift,
                            "recallStatus": check_recall,
                        }),
                        statusCode :{
                        200: function() {
                                console.log("success");
                        }
                        },
                        contentType:"application/json; charset=utf-8",
                        success: function(data, textStatus, jqXHR)
                        {
                            sessionStorage.setItem("filterProductionData" , data);
                            alert("Sucessfull");
                            document.getElementById("productionText").style.display = "none";
                            showFilterProductionData();
                        },
                        error: function (e)
                        {
                            alert("Something Went Wrong");
                            console.log(e);
                        }
                    });
        
                });

                function showFilterStoreData(){
                    if(sessionStorage.getItem("filterStoreData")){
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
            
                            var data = sessionStorage.getItem("filterStoreData");
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
                                        var finalD = formatDate(m.data[i][0]);
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

                $(".form-create-store").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();
        
                    const url = "http://34.122.82.176:9001/get/storereport"
                    document.getElementById("storeText").style.display = "inline";

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
                            "date_from": $('#input_main_date_from_store').val(),
                            "date_to": $('#input_main_date_to_store').val(),
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
                            sessionStorage.setItem("filterStoreData" , data);
                            alert("Successful");
                            document.getElementById("storeText").style.display = "none";
                            showFilterStoreData();
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
