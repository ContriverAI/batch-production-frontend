if(navigator.onLine)
{
    $(document).ready(function(){

        function TableEdit() {

            // $('td').click( function(e) {
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

            // $("td").on("click"  ,  function(e) {
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


        
        function checkLogin() {
            if(!(sessionStorage.getItem("designation") === "supervisor") && !(sessionStorage.getItem("role") === "production")){
                window.location.pathname = "/";
            }
         }
      
         checkLogin();

         
        var loaded = false

        function dataLoad(){
            if(sessionStorage.getItem("prodData")){
               loaded = true
               document.getElementById("superviser-main").style.display = "inline";
               document.getElementById("loader").style.display = "none";
            }
        }

        setInterval(dataLoad ,10000);

        
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

                } catch (err) {
                    console.error(err)
                }
            });

        }   

        getProductionData()

        function display(){

            if(loaded) {

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

                            document.getElementById('superviser_production_table').innerHTML = table_row;

                            var options = '';
                        
                            for(var i = 0; i < m.data.length; i++){
                                if(m.data[i][9] !== "Baked")
                                    options += '<option value="'+m.data[i][8]+'">'+m.data[i][8]+'</option>';
                            }
                                

                            document.getElementById('input_recall_batch').innerHTML = options;
                            // document.getElementById('input_bake_batch').innerHTML = options;
                        }
            }
                
                localProductionData();
                setInterval(localProductionData , 10000);

                function localProductionBakeData(){
                    if(sessionStorage.getItem("prodData")){
                            var table_row = `<tr>  
                                <th>Batch</th>
                                <th>Mixing Time</th>
                                <th>Status</th>
                            </tr>`;

                            var data = sessionStorage.getItem("prodData");
                            var m = JSON.parse(data);
                            // console.log(m.data);

                            for(var i = 0; i < m.data.length; i++){
                                if(m.data[i][9] === "Unbaked"){
                                        table_row += 
                                        '<tr id='+m.data[i][8]+'>'+
                                            '<td>'+m.data[i][8]+'</td>'+
                                            '<td>'+msToTime(m.data[i][5])+'</td>'+
                                            '<td><button id = "Bak" class="btn btn-lg btn-primary btn-block" type="button">Baked</button></td>'+
                                        '</tr>';
                                }
                                
                            }


                            document.getElementById('superviser_production_bake_table').innerHTML = table_row;

                        }
                }

                localProductionBakeData();
                setInterval(localProductionBakeData , 10000);

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
                    var minutes = Math.floor((duration / (1000 * 60)) % 60),
                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
                
                    hours = (hours < 10) ? "0" + hours : hours;
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                
                    return hours + ":" + minutes ;
                }
            }
        }

        setInterval(display ,10000);


        $("#Logout").click(function(event){
            event.preventDefault();
            sessionStorage.clear();
            window.location.pathname = "/";
        });

        $(document).on("click" , "#Bak"  ,  function(e) {
            e.preventDefault();
            var pid = $(this).parent().parent().attr("id");
            console.log(pid); 

            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            const url = "http://34.122.82.176:9001/get/production_bake_screen"

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
            const url = "http://34.122.82.176:9001/get/production_main_screen"

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
                    console.log(e);
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
            const url = "http://34.122.82.176:9001/get/production_recall_screen"

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
                    console.log(e);
                }
            });

            

        });
        
        //change tables
        $(".form-production-bake").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            const url = "http://34.122.82.176:9001/get/production_bake_screen"

            

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
                    console.log(e);
                }
            });

        });

        function showFilterData(){
            if(sessionStorage.getItem("filterData")){
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

                        var data = sessionStorage.getItem("filterData");
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

                        document.getElementById('filter_table').innerHTML = table_row;

            }
        }

        $(".form-create-filter").submit(function(event) {
            event.stopPropagation();
            event.preventDefault();

            const url = "http://34.122.82.176:9001/get/coolingreport"
            document.getElementById("filterText").style.display = "inline";

            $.ajax({
                url:url,
                type:"POST",
                data:JSON.stringify({
                    "date_from": $('#input_main_date_from').val(),
                    "date_to": $('#input_main_date_to').val(),
                    "product": $('#input_main_product_filter').val(),
                    "status": $('#input_packaging_status_filter').val(),
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
