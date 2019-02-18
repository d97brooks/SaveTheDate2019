var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            var guests = myObj["guest"];
            var table = document.getElementById("table");
            var totalSeats = 0;
            for(var i = 0; i < guests.length; i++){
                var row = table.insertRow(i+1);
                row.id = i;
                var name = row.insertCell(0);
                var seats = row.insertCell(1);
                var email = row.insertCell(2);
                name.innerHTML = guests[i].name;
                name.id = "name" + i;
                seats.innerHTML = guests[i].seats;
                seats.id = "seats" + i;
                totalSeats += parseInt(guests[i].seats);
                email.innerHTML = guests[i].email;
                email.id = "email" + i;
                }

            var no = myObj["noGo"];
            var noGo = document.getElementById("noGo");
            for(i=0; i < no.length; i++){
                var row = noGo.insertRow(i+1);
                var name = row.insertCell(0);
                name.id='noGo' + i;
                name.innerHTML = no[i].name;
            }
            document.getElementById("total").innerHTML = totalSeats;

        var button = document.createElement("button");
        var cancel = document.createElement("input");
        var submit = document.createElement("input");
        var add = document.createElement("button");
        add.style = 'background-color: rgb(37, 37, 36); color: lime; border-color: whitesmoke; display: inline; padding:.5%; float: left;';
        add.value = "Add Guest";
        add.id = "addButton";
        add.innerText = "Add Guest";
        button.type = 'button';
        button.value = 'Edit';
        button.innerText='Edit Table Contents';
        button.id = 'editTableButton';
        submit.id = 'editSubmit';
        submit.value = 'Submit';
        submit.type = 'submit';
        cancel.type = 'button';
        cancel.id = 'cancel';
        cancel.value='Cancel';
        cancel.style = 'background-color: rgb(37, 37, 36); color: red; border-color: red; display: inline; padding:.5%; float: right;';
        submit.style = 'background-color: rgb(37, 37, 36); color: lime; border-color: green; display: inline; padding:.5%; float: right;';
        cancel.style.display = 'none';
        submit.style.display = 'none';
        button.style = 'background-color: rgb(37, 37, 36); color: lime; border-color: whitesmoke; display: inline; padding:.5%; float: right;';
        add.onclick = function(){
            var next = document.getElementById('table').rows.length;
            var row = document.getElementById('table').insertRow(next);
            next = next-1;
            row.id = i;
            var name = row.insertCell(0);
            name.id = 'name' + next;
            var seats = row.insertCell(1);
            seats.id = 'seats' + next;
            var email = row.insertCell(2);
            email.id = 'email' + next;

            name.innerHTML="<input style='background-color: rgb(37, 37, 36); color: lime;' id ='inputName" + next+"' type='text' form='editTable' value='"+document.getElementById('name'+next).innerHTML+ "' />";
            seats.innerHTML="<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputSeats" + next+"' type='number' form='editTable' value='"+document.getElementById('seats'+next).innerHTML+ "' />";
            email.innerHTML="<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputEmail" + next+"' type='text' form='editTable' value='"+document.getElementById('email'+next).innerHTML+ "' />";
            
       }
        button.onclick = function(){
            for(var i = 0; i < document.getElementById('table').rows.length - 1; i++){
                document.getElementById('name'+i).innerHTML = "<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputName" + i+"' type='text' form='editTable' value='"+document.getElementById('name'+i).innerHTML+ "' />";
                document.getElementById('seats'+i).innerHTML = "<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputSeats" + i+"' type='number' form='editTable' value='"+document.getElementById('seats'+i).innerHTML+ "' />";
                document.getElementById('email'+i).innerHTML = "<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputEmail" + i+"' type='text' form='editTable' value='"+document.getElementById('email'+i).innerHTML+ "' />";
                
            }
            for(var i = 0; i<document.getElementById('noGo').rows.length-1; i++){
                document.getElementById('noGo'+i).innerHTML = "<input style = 'background-color: rgb(37, 37, 36); color: lime;' id ='inputNoGoName" + i+"' type='text' form='editTable' value='"+document.getElementById('noGo'+i).innerHTML+ "' />";
            }
                document.getElementById('cancel').style.display = 'inline';
                document.getElementById('editSubmit').style.display = 'inline';
                document.getElementById('editTableButton').style.display = 'none';
                document.getElementById('add').appendChild(add);
                document.getElementById('addButton').style.display= 'inline';
                // var row = document.getElementById('table').insertRow(document.getElementById('table').rows.length)
            };
        cancel.onclick = function(){
            for(var i = 0; i < guests.length; i++){
                document.getElementById('name'+i).innerHTML = guests[i].name;
                document.getElementById('seats'+i).innerHTML = guests[i].seats;
                document.getElementById('email'+i).innerHTML = guests[i].email;
            }
            if(guests.length+1 < document.getElementById('table').rows.length){
                var l = document.getElementById('table').rows.length;
                var table = document.getElementById('table');
                for(var i = l; i > guests.length+1; i--){
                    table.deleteRow(i-1);
                }
            }
            
            for(var i = 0; i<document.getElementById('noGo').rows.length-1; i++){
                document.getElementById('noGo'+i).innerHTML = myObj["noGo"][i].name;
            }
            document.getElementById('addButton').style.display = 'none';
            document.getElementById('cancel').style.display = 'none';
            document.getElementById('editSubmit').style.display = 'none';
            document.getElementById('editTableButton').style.display = 'block';
            
            
        };
        submit.onclick = function(){
            myObj = {'guests':'','guest':[],'noGo':[]};
            
            for(var i = 0; i < document.getElementById('table').rows.length - 1; i++){
                var name = document.getElementById('inputName'+i).value;
                if(name == ""){
                    // remove from table
                    // i.e. just dont add on rebuild
                }else{                
                    var seats = document.getElementById('inputSeats'+i).value;
                    if(seats == "0" || seats == ""){
                        myObj["noGo"].push({name: name});
                    }else{
                        var email = document.getElementById('inputEmail'+i).value;
                        myObj["guest"].push({name: name, seats: seats, email: email});
                    }
                }
            }
            
            for(var i = 0; i < document.getElementById('noGo').rows.length - 1; i++){
                var name = document.getElementById('inputNoGoName'+i).value
                if(name != "")
                    myObj["noGo"].push({name: name});
            }
            document.getElementById('guests').value = JSON.stringify(myObj);
            //alert(document.getElementById('guests').value);
        };
            document.getElementById('editTable').appendChild(submit);
            document.getElementById('editTable').appendChild(cancel);
            document.getElementById('editTable').appendChild(button);
        }
    }
    xmlhttp.open("GET", "/guests.json", true);
    xmlhttp.send();
