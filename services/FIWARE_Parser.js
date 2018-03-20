/**
 * Created by Mac on 13/03/2018.
 */
module.exports.contextJSONParser=function (contentInstance)
{

    console.log(contentInstance)
    var fiware=[]
    var conkeys=Object.keys(contentInstance)  //extract all keys
    var newObject = new JsonObject();
    for(var i=0;i<conkeys.length;i++)
    {
        var data;
        var fiwareString="{";
        var value="\""+contentInstance[conkeys[i]]+"\""
        var key_string=conkeys[i]
        var type_string="\"type\""
        var value_string="\"value\""
        var text_string="\"Text\""
        var structure_string="\"Structured Value\""
        var meta_string="\"metadata\""
        var geojson_string="\"geo:json\""
        var coordinates_string="\"coordinates\""
        var point_string="\"Point\""
        if(conkeys[i].toLocaleLowerCase()=="type" || conkeys[i].toLocaleLowerCase()=="id")
        {
            fiware[key_string]=contentInstance[conkeys[i]]
            fiwarestring.concat("\""+key_string+"\":"+value+",");
        }
        else if(conkeys[i].toLocaleLowerCase()=="location")
        {

            var locationestring=JSON.stringify(contentInstance['location']['coordinates'])
            // locationestring = locationestring.replace(/"/g,'');
            // locationestring = locationestring.replace(/'/g,'');
                data={
                    "type": "geo:json",
                    "value": {
                        "type": "Point",
                        "coordinates":locationestring
                    },
                    "metadata": {}
                }

            fiware[key_string]=data
        }
        else if(conkeys[i].toLocaleLowerCase()!="type" && conkeys[i].toLocaleLowerCase()!="id" && conkeys[i].toLocaleLowerCase()!="location"
                 &&  (typeof contentInstance[conkeys[i]]=="string"))
        {


            data={
                "type": "Text",
                "value":contentInstance[conkeys[i]],
                "metadata": {}
            }
            fiware[key_string]=data
        }
        else if(typeof contentInstance[conkeys[i]]=="boolean")
        {
            fiware[conkeys[i]]={};
            data={
                "type": "Boolean",
                "value":contentInstance[conkeys[i]],
                "metadata": {}
            }
            fiware[key_string]=data

        }
        else if(typeof contentInstance[conkeys[i]]=='number')
            // data is an integer
        {
            fiware[conkeys[i]]={};
            data={
                "type": "number",
                "value":contentInstance[conkeys[i]],
                "metadata": {}
            }
            fiware[key_string]=data

        }
        else
        {

            var locationestring=JSON.stringify(contentInstance[conkeys[i]])
            console.log(locationestring)
            locationestring = locationestring.replace(/"/g,'');
            locationestring = locationestring.replace(/'/g,'');
            fiware[conkeys[i]]={};
            data={
                "type": "Structured Value",
                "value":locationestring,
                "metadata": {}
            }
            fiware[key_string]=data

        }
    }
     console.log("FIWARE DATA=",fiware);
   // fiware= JSON.parse('{"x":' + fiware.columns.replace(/'/g, '"') + '}').x
    var fiwarestring=JSON.stringify(fiware)
    fiwarestring = fiwarestring.replace(/'/g,'');
     console.log("FIWARE DESCRIPTION=",fiwarestring);

}
module.exports.stringfi_json=function (jsonObject)
{
    try
    {
        var conkeys=Object.keys(jsonObject)  //extract all keys
        var stringBuilder="{\n"
        var len=conkeys.length
        for(var i=0;i<conkeys.length;i++)
        {

            var keyvalue=jsonObject[conkeys[i]];
            if(conkeys[i].toLocaleLowerCase()=="type" || conkeys[i].toLocaleLowerCase()=="id")
            {
                var temporarystring="\""+conkeys[i]+"\""+":"+"\""+keyvalue.toString()+"\""

                stringBuilder=stringBuilder+temporarystring

            }
            else if(typeof jsonObject[conkeys[i]]==="string")
            {
                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"Text\","+
                    "\"value\":"+"\""+jsonObject[conkeys[i]]+"\","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data

            }
            else if(typeof jsonObject[conkeys[i]]==="boolean")
            {
                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"Boolean\","+
                    "\"value\":"+jsonObject[conkeys[i]]+","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data

            }
            else if(conkeys[i].toLocaleLowerCase()=="location")
            {
                // if(typeof jsonObject['location']['coordinates'][0]=="string")
                // {
                    var result=jsonObject['location']['coordinates'].map(Number);
                    var location=JSON.stringify(result)
                    data="\""+conkeys[i]+"\""+":"+"{\n"+
                        "\"type\":"+"\"geo:json\","+
                        "\"value\":"+
                        "{"
                        +"\"type\":"+"\"Point\","
                        +"\"coordinates\":"+location+
                        "},"+
                        "\"metadata\":{}"
                        +"\n}"
                    stringBuilder=stringBuilder+data
                // }
                // else
                // {
                //     var len=jsonObject['location']['coordinates'];
                //     var locaArray=[];
                //     for(var loc in jsonObject['location']['coordinates'] )
                //     {
                //
                //         var loc_number=(jsonObject['location']['coordinates'][loc]).map(Number);
                //         locaArray.push(loc_number)
                //     }
                //     var location=JSON.stringify(locaArray)
                //     data="\""+conkeys[i]+"\""+":"+"{\n"+
                //         "\"type\":"+"\"geo:json\","
                //         +"\"value\":"
                //         +"{"
                //         +"\"type\":"+"\"Point\","
                //         +"\"coordinates\":"+location
                //         +"},"
                //         +"\"metadata\":{}"
                //         +"\n}"
                //     stringBuilder=stringBuilder+data
                // }

            }
            else
            {

                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"StructuredValue\","+
                    "\"value\":"+Structured+","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data
            }
            stringBuilder=stringBuilder+","



        }
        stringBuilder = stringBuilder.slice(0, -1);
        stringBuilder=stringBuilder+"\n}"
        return stringBuilder
    }
    catch (error)
    {
        console.log(error)
    }

        //console.log(stringBuilder)


}
module.exports.updatestringfi_json=function (jsonObject)
{
    try
    {
        var conkeys=Object.keys(jsonObject)  //extract all keys
        var stringBuilder="{\n"
        var len=conkeys.length
        for(var i=0;i<conkeys.length;i++)
        {

            var keyvalue=jsonObject[conkeys[i]];
            if(typeof jsonObject[conkeys[i]]==="string" && (conkeys[i].toLocaleLowerCase()!="type" && conkeys[i].toLocaleLowerCase()=="id"))
            {
                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"Text\","+
                    "\"value\":"+"\""+jsonObject[conkeys[i]]+"\","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data

            }
            else if(typeof jsonObject[conkeys[i]]==="boolean")
            {
                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"Boolean\","+
                    "\"value\":"+jsonObject[conkeys[i]]+","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data

            }
            else if(conkeys[i].toLocaleLowerCase()=="location")
            {
                // if(typeof jsonObject['location']['coordinates'][0]=="string")
                // {
                    var result=jsonObject['location']['coordinates'].map(Number);
                    var location=JSON.stringify(result)
                    data="\""+conkeys[i]+"\""+":"+"{\n"+
                        "\"type\":"+"\"geo:json\","+
                        "\"value\":"+
                        "{"
                        +"\"type\":"+"\"Point\","
                        +"\"coordinates\":"+location+
                        "},"+
                        "\"metadata\":{}"
                        +"\n}"
                    stringBuilder=stringBuilder+data
                // }
                // else
                // {
                //     var len=jsonObject['location']['coordinates'];
                //     var locaArray=[];
                //     for(var loc in jsonObject['location']['coordinates'] )
                //     {
                //
                //         var loc_number=(jsonObject['location']['coordinates'][loc]).map(Number);
                //         locaArray.push(loc_number)
                //     }
                //     var location=JSON.stringify(locaArray)
                //     data="\""+conkeys[i]+"\""+":"+"{\n"+
                //         "\"type\":"+"\"geo:json\","
                //         +"\"value\":"
                //         +"{"
                //         +"\"type\":"+"\"Point\","
                //         +"\"coordinates\":"+location
                //         +"},"
                //         +"\"metadata\":{}"
                //         +"\n}"
                //     stringBuilder=stringBuilder+data
                // }

            }
            else
            {

                var Structured=JSON.stringify(jsonObject[conkeys[i]])
                // Structured = Structured.replace(/"/g,'');
                data="\""+conkeys[i]+"\""+":"+"{\n"+
                    "\"type\":\"StructuredValue\","+
                    "\"value\":"+Structured+","+
                    "\"metadata\": {}"+
                    "\n}"
                stringBuilder=stringBuilder+data
            }
            stringBuilder=stringBuilder+","



        }
        stringBuilder = stringBuilder.slice(0, -1);
        stringBuilder=stringBuilder+"\n}"
        return stringBuilder
    }
    catch (error)
    {
        console.log(error)
    }

    //console.log(stringBuilder)


}
