if(navigator.onLine)
{
    $(document).ready(function(){

        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "admin") && !(sessionStorage.getItem("role") === "system")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

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

                    var table_row = `<tr>
                        <th>Date</th>
                        <th>Trolley</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Time In</th>
                        <th>Duration</th>
                        <th>Complete Time</th>
                        <th>Packaging Complete </th>
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

                    document.getElementById('cooling_table').innerHTML = table_row;


                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getCoolingData()

        function localCoolingData(){

            if(sessionStorage.getItem("tableData")){
                var table_row = `<tr>
                            <th>Date</th>
                            <th>Trolley</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Time In</th>
                            <th>Duration</th>
                            <th>Complete Time</th>
                            <th>Packaging Complete </th>
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

                        document.getElementById('cooling_table').innerHTML = table_row;
                }
        }

        setInterval(localCoolingData , 3000);

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
                        <th>Batch</th>
                        <th>Status</th>
                        <th>Batch Recall</th>
                        <th>Recall Time</th>
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
                                    '<td>'+m.data[i][13]+'</td>'+
                                    '<td>'+m.data[i][14]+'</td>'+
                                    '<td>'+m.data[i][15]+'</td>'+
                                    '<td>'+msToTime(m.data[i][17])+'</td>'+
                                '</tr>';
                        
                    }

                    document.getElementById('production_table').innerHTML = table_row;

                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getProductionData()

        function localProductionData(){
            if(sessionStorage.getItem("prodData")){
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
                        <th>Batch</th>
                        <th>Status</th>
                        <th>Batch Recall</th>
                        <th>Recall Time</th>
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
                                    '<td>'+m.data[i][13]+'</td>'+
                                    '<td>'+m.data[i][14]+'</td>'+
                                    '<td>'+m.data[i][15]+'</td>'+
                                    '<td>'+msToTime(m.data[i][17])+'</td>'+
                                '</tr>';
                        
                    }

                    document.getElementById('production_table').innerHTML = table_row;
                }
        }

        setInterval(localProductionData , 3000);

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
                    sessionStorage.setItem("storeData" , JSON.stringify(d));

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
                                '</tr>';
                    }

                    document.getElementById('store_table').innerHTML = table_row;


                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getStoreData()

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
                                '</tr>';
                    }

                    document.getElementById('store_table').innerHTML = table_row;
                }
        }

        setInterval(localStoreData , 3000);

         function getUsersData(){

            var settings = {
                "url": "http://34.122.82.176:9001/get/allusers",
                "method": "GET",
                "timeout": 0,
              };
              
              $.ajax(settings).done(function (response) {
                var d = JSON.parse(response);
                console.log(d.columns);
                console.log(d.data);
                sessionStorage.setItem("usersData" , JSON.stringify(d));
                
              });

              var table_row = `<tr>
                    <th>Username</th>
                    <th>Designation</th>
                    <th>Role</th>
                </tr>`;

                var data = sessionStorage.getItem("usersData");
                var m = JSON.parse(data);
                console.log(m.data);

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

        getUsersData();

        function getConfigData(){

            var settings = {
                "url": "http://34.122.82.176:9001/get/configparams",
                "method": "GET",
                "timeout": 0,
              };
              
              $.ajax(settings).done(function (response) {
                var d = JSON.parse(response);
                console.log(d.columns);
                console.log(d.data);
                sessionStorage.setItem("configData" , JSON.stringify(d));
                
              });

              var table_row = `<tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Cooling Duration (in mins)</th>
                </tr>`;

                var data = sessionStorage.getItem("configData");
                var m = JSON.parse(data);
                console.log(m.data);

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

        getConfigData();

        
        $(".form-create-user").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/create_user"

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
                    getUsersData();
                    alert(data);
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
                    getUsersData();
                    alert(data);
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
                    getUsersData();
                    alert(data);
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
    
    });
}
else
{
    alert('You are Offline')
}
