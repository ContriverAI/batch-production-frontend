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

                                        document.getElementById('cooling_table').innerHTML = table_row;
                                }
                        }

                        localCoolingData();
                        setInterval(localCoolingData , 10000);

                        function localProductionData(){
                            if(sessionStorage.getItem("prodData")){
                                        var table_row = `<tr>    
                                            <th>Date</th>
                                            <th>Shift</th>
                                            <th>Batch</th>
                                            <th>Flour</th>
                                            <th>Remix</th>
                                            <th>Yeast</th>
                                            <th>Product</th>
                                            <th>Yield Value </th>
                                            <th>Mixing Time</th>
                                            <th>Status</th>
                                            <th>Baking Time</th>
                                            <th>Batch Recall</th>
                                            <th>Recall Time</th>
                                        </tr>`;

                                    var data = sessionStorage.getItem("prodData");
                                    var m = JSON.parse(data);
                                    console.log(m.data);

                                    for(var i = 0; i < m.data.length; i++){
                                                var date = new Date(m.data[i][0]);
                                                var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();

                                                table_row += 
                                                '<tr>'+
                                                    '<td>'+ finalD +'</td>'+
                                                    '<td>'+m.data[i][2]+'</td>'+
                                                    '<td>'+m.data[i][8]+'</td>'+
                                                    '<td>'+m.data[i][1]+'</td>'+
                                                    '<td>'+m.data[i][3]+'</td>'+
                                                    '<td>'+m.data[i][4]+'</td>'+
                                                    '<td>'+m.data[i][13]+'</td>'+
                                                    '<td>'+m.data[i][10]+'</td>'+
                                                    '<td>'+msToTime(m.data[i][5])+'</td>'+
                                                    '<td>'+m.data[i][9]+'</td>'+
                                                    '<td>'+msToTime(m.data[i][6])+'</td>'+
                                                    '<td>'+m.data[i][11]+'</td>'+
                                                    '<td>'+msToTime(m.data[i][12])+'</td>'+
                                                '</tr>';
                                        
                                    }

                                    document.getElementById('production_table').innerHTML = table_row;
                                }
                        }

                        localProductionData();
                        setInterval(localProductionData , 10000);

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
                                            <th>Pkg Supervisor</th>
                                            <th>Dispatched Date</th>
                                            <th>Dispatch Supervisor</th>
                                        </tr>`;

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
                                                    var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                                                    var date_1 = new Date(m.data[i][11])
                                                    var finalD_1 = date_1.getDate()+'-' + (date_1.getMonth()+1) + '-'+date_1.getFullYear();
                                                    
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
                                                        '<td>'+m.data[i][10]+'</td>'+
                                                        '<td>'+finalD_1+'</td>'+
                                                        '<td>'+m.data[i][12]+'</td>'+
                                                    '</tr>';
                                        }

                                        document.getElementById('store_table').innerHTML = table_row;
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
                    var m = JSON.parse(data);
                    console.log(m.data);

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
                    console.log(m.data);

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
                                            var finalD = date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
        
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
        
                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "date_from": $('#input_main_date_from_cooling').val(),
                            "date_to": $('#input_main_date_to_cooling').val(),
                            "product": $('#input_main_product_filter_cooling').val(),
                            "packaging": $('#input_packaging_status_filter_cooling').val(),
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
                            alert(data);
                            document.getElementById("coolingText").style.display = "none";
                            showFilterCoolingData();
                        },
                        error: function (e)
                        {
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
        
                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "date_from": $('#input_main_date_from_production').val(),
                            "date_to": $('#input_main_date_to_production').val(),
                            "product": $('#input_main_product_filter_production').val(),
                            "status": $('#input_packaging_status_filter_production').val(),
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
                            alert(data);
                            document.getElementById("productionText").style.display = "none";
                            showFilterProductionData();
                        },
                        error: function (e)
                        {
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

                $(".form-create-store").submit(function(event) {
                    event.stopPropagation();
                    event.preventDefault();
        
                    const url = "http://34.122.82.176:9001/get/storereport"
                    document.getElementById("storeText").style.display = "inline";
        
                    $.ajax({
                        url:url,
                        type:"POST",
                        data:JSON.stringify({
                            "date_from": $('#input_main_date_from_store').val(),
                            "date_to": $('#input_main_date_to_store').val(),
                            "product": $('#input_main_product_filter_store').val(),
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
                            alert(data);
                            document.getElementById("storeText").style.display = "none";
                            showFilterStoreData();
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
