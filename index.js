var firebase = require('firebase');
var	nn = require('nearest-neighbor');
var geolib = require('geolib');

	
firebase.initializeApp({
    databaseURL: 'https://niceride-2c7b4.firebaseio.com'
    });

var bookerId=0;
var booker_Ride_Id=0
var OwnerId=0;
var bookerLat=0;
var bookerLong=0;
var OwLatitude=0;
var OwLongitude=0;
var Dist=0;
var dist1=0;
var uid_Owner=0;
var uid_Ride = 0;
var Nb_seets=0;
var att=false;
var attribue= {};
var  bookerAtt;
//Tables_________________________________________________________________________
array : var array =[];
arrayR : var array =[];
arrayO : var array = [];
arrayd: var array = [];
//References____________________________________________________________________________________________
var UserRef = firebase.database().ref('users');
var AskRef= firebase.database().ref('askforride');
var key;
var RidesRef = firebase.database().ref('rides');


//AskforRide---------------------------------------------------------------------------------------------
array = new Array();
function ReadAskes()
{
var queryAsk = AskRef.on('child_added', function(snapOwn) { 
   
  array.push(snapOwn.val());
    key=snapOwn.key;
    
});
}
  
function var_att()
{
    var i=0;
   for(i=0;i<array.length;i++)
       {
    bookerId= array[i].uidbooker;
    OwnerId = array[i].uidowner;
    bookerLat =array[i].lat;
    bookerLong = array[i].long;
   
       }
   
}

//Appele___________________________________________________________________________________________

ReadAskes(); 
setTimeout(var_att, 3000);
setTimeout(Rides, 4000); 
setTimeout(rides_att,6000);
setTimeout(Owners,7000);
setTimeout(owner_att,8000);
setTimeout(Calcul_distance,9000);

//Rides____________________________________________________________________________________________________
arrayR = new Array();
function Rides()
{
    
	var RidesQuery=RidesRef.on('child_added', function(snapR) {    
			if(snapR.val().uid==OwnerId)
                {
          arrayR.push(snapR.val());
         
                }          
    });
   
}

function rides_att()
{   var j=0;
  
   for(j=0;j<arrayR.length;j++)
       {
           uid_Ride = arrayR[j].uid;
    Nb_seets = arrayR[j].nbseats;
            console.log('nnnn1',Nb_seets);
       }
}
// Owneeeeeeeeeeeeeeeeeeeers____________________________________________________________________________
arrayO = new Array()
function Owners()
{
   
var queryOwner = UserRef.orderByChild("owner").equalTo("true").on('child_added', function(snapOwn) { 
  
				{
                    if(snapOwn.val().uid == uid_Ride)
                        {
        		    arrayO.push(snapOwn.val());
                        }
                    
				}
      }); 
}
function owner_att()
{
    var k=0
    for(k=0;k<arrayO.length;k++)
       {
    				uid_Owner= arrayO[k].uid;
				    OwLatitude=arrayO[k].latitude;
				    OwLongitude=arrayO[k].longitude;
       }
}

//Distances____________________________________________________________________________________________________
arrayd= new Array();  
function Calcul_distance()
{
   var h=0;
     var AskRefA;
    for(h=0;h<array.length;h++)
        {
            bookerLat=array[h].lat;
            bookerLong = array[h].long;
            bookerId= array[h].uidbooker;
            OwnerId = array[h].uidowner;
           bookerAtt = array[h].attribution;
        
        Dist = geolib.getDistance(
                   {latitude:OwLatitude , longitude: OwLongitude},
                    {latitude: bookerLat, longitude: bookerLong}
                 );
            attribue =    
            {
                D: Dist,
                idO: OwnerId,
                idB: bookerId,
                At :bookerAtt
            }
            arrayd.push(attribue);
        }
   console.log('l',arrayd.length);   
  console.log('nnnn11',Nb_seets);
   
     if(Nb_seets>=0)
        {
            var s=0;
            
           
          
         for(s=0;s<=(arrayd.length)+1;s++)
             {
            console.log('sf',s);     
    console.log("sss",arrayd[s].D);
     console.log("sss1",arrayd[s+1].D);
    if(arrayd[s].D<=arrayd[s+1].D)
        {
            console.log('fff',arrayd[s].At);
            console.log('s',s);
            att=true;
        Nb_seets= Nb_seets-1;
        console.log('att',att);
        var bb = arrayd[s].idB; 
                
            console.log('bb',bb);
           
                
        console.log(Nb_seets);
                Nb_seets=Nb_seets-1;
               var l=0;
            AskRef.orderByChild("uidbooker").equalTo(bb).on('value', function(snapOwn) { 
                     key=snapOwn.key;
                console.log('kk',snapOwn.val());
                        snapOwn.forEach(function(snapshot){
                            console.log('hzyya',snapshot.key());
                            AskRefA= firebase.database().ref('askforride').child(snapshot.key()).update(
                        {
                    attribution: att
                        });
                            
                        });
                        
                  
                  });
                  
                  
                                 
                  
           
              
        }
             } 
        }
  
          
        }          

       
		
                              